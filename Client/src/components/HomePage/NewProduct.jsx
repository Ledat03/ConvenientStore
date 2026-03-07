import { useEffect, useState } from "react";
import "../../assets/scss/BestSeller.scss";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { getNewProduct } from "../../services/GetAPI";
const NewProduct = (props) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const calSavePrice = (salePrice, price) => {
    let sale = ((salePrice - price) / price) * 100;
    return Math.round(sale);
  };

  const fetchProducts = async (targetPage, isLoadMore) => {
    if (loading) return;
    setLoading(true);
    try {
      const payload = {
        type: "new",
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
      console.log("Fetch new products error:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
          <h2 className="best-sellers__title">Các sản phẩm mới</h2>
          <p className="best-sellers__subtitle">Cùng xem qua các sản phẩm mới với giá đầy hấp dẫn</p>
        </div>
        <div className="best-sellers__grid">
          {products.map((item, index) => {
            return (
              <Link to={`products/product/${item.productId}?variant=${item.calUnit}`} className="product-card-main" key={index}>
                <div className={`product-card-main__badge ${item.stock != 0 ? "product-card-main__badge--low-stock" : "product-card-main__badge--out-stock"}`}>{item.stock > 0 ? "Còn Hàng" : "Hết Hàng"}</div>
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
                      {item.salePrice != 0 && (
                        <>
                          <span className="product-card-main__discount">Save {calSavePrice(item.price, item.salePrice)}%</span>
                        </>
                      )}
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

export default NewProduct;
