import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AddToCart } from "../../../services/UserSevice";
const ProductCard = ({ products, filters, Loading, onSortChange, sortBy }) => {
  const calSavePrice = (salePrice, price) => {
    let sale = ((salePrice - price) / price) * 100;
    return Math.round(sale);
  };
  const [totalProduct, setTotalProduct] = useState(0);
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    if (ActiveProduct) {
      setTotalProduct(ActiveProduct.length);
    } else if (products) {
      setTotalProduct(products.length);
    }
    IsLogIn();
  }, [filters, Loading]);
  const ActiveProduct = products
    .filter((item) => item.Active == true)
    .filter((item) => {
      console.log(item);
      if (filters.availability.length === 0) {
        return true;
      }
      if (filters.availability.includes("in-stock") && item.stock > 20) {
        return true;
      }
      if (filters.availability.includes("low-stock") && item.stock > 0 && item.stock <= 20) {
        return true;
      }
      if (filters.availability.includes("out-of-stock") && item.stock == 0) {
        return true;
      }

      return false;
    })
    .filter((item) => {
      if (filters.unit.length === 0) {
        return true;
      }
      if (filters.unit.includes(item.calUnit)) {
        return true;
      }
      return false;
    })
    .filter((item) => {
      if (filters.category.length === 0) {
        return true;
      }
      if (filters.category.includes(item.subCategory.subCategoryName)) {
        return true;
      }
      return false;
    })
    .filter((item) => {
      if (filters.brand.length === 0) {
        return true;
      }
      if (filters.brand.includes(item.brand.brandName)) {
        return true;
      }
      return false;
    })
    .filter((item) => {
      if (filters.priceRange[0] === 0 && filters.priceRange[1] === 1000000) {
        return true;
      }
      if (item.price >= filters.priceRange[0] && item.price <= filters.priceRange[1]) {
        return true;
      }
      return false;
    })
    .filter((item) => {
      if (filters.sale.length === 0) return true;
      if (filters.sale.includes("sale-price") && item.salePrice > 0) {
        return true;
      }
      if (filters.sale.includes("regular") && item.salePrice === 0) {
        return true;
      }
      return false;
    });
  const IsLogIn = () => {
    const checkUser = localStorage?.getItem("user");
    if (checkUser != null) {
      const parse = JSON.parse(checkUser);
      setUserData(parse);
    }
  };
  const handleAddToCart = async (variantId, productId) => {
    const info = {
      userId: userData.id,
      variantId: variantId,
      productId: productId,
      quantity: 1
    };
    await AddToCart(info);
    toast.success("Thêm Vào Giỏ Hàng Thành Công");

  };

  const sortedProducts = onSortChange(ActiveProduct, sortBy);
  return (
    <>
      <div className="product-grid">
        {products.length != 0 ? (
          products.map((item, index) => {
            return (
              <Link to={`product/${item.productId}?variant=${item.calUnit}`} className="product-card-detail" key={index}>
                {item.stock >= 0 && (
                  <div className={`product-card-detail__badge ${item.stock > 20 && "product-card-detail__badge--high-stock"} ${item.stock === 0 && "product-card-detail__badge--out-stock"}`}>
                    {item.stock > 20 && "Còn Hàng"}
                    {item.stock === 0 && "Hết Hàng"}
                    {item.stock > 0 && item.stock <= 20 && "Sắp Hết Hàng"}
                  </div>
                )}

                <div className="product-card-detail__image-container">
                  <img src={item.image || "/placeholder.svg?height=200&width=200"} alt={item.productName} className="product-card-detail__image" />
                </div>
                <div className="product-card-detail__info">
                  <h3 className="product-card-detail__name">{item.productName}</h3>
                  <div className="product-card-detail__tags">
                    <span className="product-card-detail__tag">{item.subCategory}</span>
                    <span className="product-card-detail__tag">{item.brand}</span>
                    <span className="product-card-detail__tag">{item.calUnit}</span>
                  </div>

                  {item.salePrice != 0 ? (
                    <div className="product-card-detail__pricing">
                      <span className="product-card-detail__current-price">{item.salePrice.toLocaleString("vn-VN", { style: "currency", currency: "VND" })}</span>
                      <span className="product-card-detail__original-price">{item.price.toLocaleString("vn-VN", { style: "currency", currency: "VND" })}</span>
                      {item.salePrice != 0 && (
                        <>
                          <span className="product-card-detail__discount">Save {calSavePrice(item.price, item.salePrice)}%</span>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="product-card-detail__pricing">
                      <span className="product-card-detail__current-price">{item.price.toLocaleString("vn-VN", { style: "currency", currency: "VND" })}</span>
                    </div>
                  )}

                  <div className="Card-ButtonGroup">
                    <Button
                      className="Card-Button"
                      onClick={(e) => {
                        e.preventDefault();
                        if (localStorage.getItem("user") != null) {
                          handleAddToCart(item.id, item.productId);
                        } else {
                          navigate("/authenticate");
                        }
                      }}
                      disabled={item.stock === 0}
                    >
                      {item.stock === 0 ? "Hết Hàng" : "Thêm vào giỏ hàng"}
                    </Button>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div>Không có sản phẩm nào</div>
        )}
      </div>
      <div className="pagination-container">

      </div>
    </>
  );
};

export default ProductCard;
