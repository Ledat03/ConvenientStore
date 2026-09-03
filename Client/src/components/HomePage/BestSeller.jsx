import React, { useEffect, useState } from "react";
import "../../assets/scss/BestSeller.scss";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { getNewProduct } from "../../services/GetAPI";
import KleenPromotion from "../../assets/maxkleen-promotion.webp"
const BestSeller = (props) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const calSavePrice = (salePrice, price) => {
    let sale = ((salePrice - price) / price) * 100;
    return Math.round(sale);
  };

  const fetchProducts = async (targetPage = 0, isLoadMore = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const payload = {
        type: "seller",
        page: targetPage,
      };
      const response = await getNewProduct(payload);
      const pageProducts = response?.data?.data || [];
      const totalItems = response?.data?.totalItems || 0;

      setProducts((prev) => (isLoadMore ? [...prev, ...pageProducts] : pageProducts));

      const loadedCount = (targetPage + 1) * 8;
      setHasMore(loadedCount < totalItems && pageProducts.length > 0);
      setPage(targetPage);
    } catch (error) {
      console.log("Fetch best seller products error:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setProducts([]);
    setPage(0);
    setHasMore(true);
    fetchProducts(0, false);
  }, []);

  const handleLoadMore = () => {
    if (!hasMore || loading) return;
    fetchProducts(page + 1, true);
  };

  return (
    <section className="best-sellers">
      <div className="container">
        <div className="best-sellers__header">
          <h2 className="best-sellers__title">Bán chạy nhất trong tháng</h2>
          <p className="best-sellers__subtitle">Đừng bỏ lỡ các sản phẩm có giá tốt trong tháng</p>
        </div>

        <div className="best-sellers__layout">
          <div className="best-sellers__ad best-sellers__ad--left">
            <a href=""><img src={KleenPromotion} alt="" />
            </a>
          </div>

          <div className="best-sellers__grid">
            {products.map((item, index) => {
              if (item.stock <= 0) return null;
              return (
                <Link to={`products/product/${item.productId}?variant=${item.calUnit}`} className="product-card-main" key={index}>
                  <div className={`product-card-main__badge ${item.stock != 0 ? "product-card-main__badge--low-stock" : "product-card-main__badge--out-stock"}`}>{item.stock === 0 ? "Hết Hàng" : "Còn Hàng"}</div>
                  <div className="product-card-main__image-container">
                    <img src={item.productImage[0] || "/placeholder.svg?height=200&width=200"} alt={item.productName} className="product-card-main__image" />
                  </div>
                  <div className="product-card-main__info">
                    <h3 className="product-card-main__name">{item.productName}</h3>
                    <div className="product-card-main__tags">
                      <span className="product-card-main__tag">{item.subCategory}</span>
                      <span className="product-card-main__tag">{item.brand}</span>
                      <span className="product-card-main__tag">{item.calUnit}</span>
                    </div>

                    {item.salePrice != 0 ? (
                      <div className="product-card-main__pricing">
                        <span className="product-card-main__current-price">{item.salePrice.toLocaleString("vn-VN", { style: "currency", currency: "VND" })}</span>
                        <span className="product-card-main__original-price">{item.price.toLocaleString("vn-VN", { style: "currency", currency: "VND" })}</span>
                        <span className="product-card-main__discount">Save {calSavePrice(item.price, item.salePrice)}%</span>
                      </div>
                    ) : (
                      <div className="product-card-main__pricing">
                        <span className="product-card-main__current-price">{item.price.toLocaleString("vn-VN", { style: "currency", currency: "VND" })}</span>
                      </div>
                    )}

                    <div className="Card-ButtonGroup">
                      <Button
                        className="Card-Button"
                        onClick={(e) => {
                          e.preventDefault();
                          if (localStorage.getItem("user") != null) {
                            props.handleAddToCart(item.id, item.productId);
                          } else {
                            navigate("/authenticate");
                          }
                        }}
                      >
                        Thêm vào giỏ hàng
                      </Button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="best-sellers__ad best-sellers__ad--right">
            <img src="" alt="" />
          </div>
        </div>

        <div className="best-sellers__footer">
          {hasMore && (
            <a className="best-sellers__view-all" onClick={handleLoadMore}>
              {loading ? "Đang tải..." : "Xem Thêm →"}
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default BestSeller;
