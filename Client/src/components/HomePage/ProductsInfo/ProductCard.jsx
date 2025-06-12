import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Paginate from "../../common/Paginate";
import { toast } from "react-toastify";
import { AddToCart } from "../../../services/UserSevice";
const ProductCard = ({ products, filters }) => {
  const calSavePrice = (salePrice, price) => {
    let sale = ((salePrice - price) / price) * 100;
    return Math.round(sale);
  };
  const [PaginatedProduct, setPaginatedProduct] = useState([]);
  const itemsPerPage = 9;
  const [totalProduct, setTotalProduct] = useState(0);
  const [userData, setUserData] = useState({});
  console.log(userData);
  const navigate = useNavigate();
  useEffect(() => {
    if (ActiveProduct) {
      setTotalProduct(ActiveProduct.length);
    } else {
      setTotalProduct(products.length);
    }
    IsLogIn();
  }, [filters]);
  const ActiveProduct = products
    .filter((item) => item.Active == "true")
    .filter((item) => {
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
      if (filters.category.includes(item.subCategory)) {
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
    };
    const res = await AddToCart(info);
    toast.success("Thêm Vào Giỏ Hàng Thành Công");
    console.log("thông tin gửi đi - " + info.userId + " " + info.variantId + " " + info.productId);
  };
  return (
    <>
      <div className="product-grid">
        {PaginatedProduct.length != 0 ? (
          PaginatedProduct.map((item, index) => {
            return (
              <Link to={`product/${item.productId}?variant=${item.calUnit}`} className="product-card" key={index}>
                {item.stock && <div className={`product-card__badge ${item.stock != 0 ? "product-card__badge--low-stock" : "product-card__badge--out-stock"}`}>{item.stock > 0 ? "Còn Hàng" : "Hết Hàng"}</div>}
                <div className="product-card__image-container">
                  <img src={item.productImage[0] || "/placeholder.svg?height=200&width=200"} alt={item.productName} className="product-card__image" />
                </div>
                <div className="product-card__info">
                  <h3 className="product-card__name">{item.productName}</h3>
                  <div className="product-card__tags">
                    <span className="product-card__tag">{item.subCategory}</span>
                    <span className="product-card__tag">{item.brand}</span>
                    <span className="product-card__tag">{item.calUnit}</span>
                  </div>

                  {item.salePrice != 0 ? (
                    <div className="product-card__pricing">
                      <span className="product-card__current-price">{item.salePrice.toLocaleString("vn-VN", { style: "currency", currency: "VND" })}</span>
                      <span className="product-card__original-price">{item.price.toLocaleString("vn-VN", { style: "currency", currency: "VND" })}</span>
                      {item.salePrice != 0 && (
                        <>
                          <span className="product-card__discount">Save {calSavePrice(item.price, item.salePrice)}%</span>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="product-card__pricing">
                      <span className="product-card__current-price">{item.price.toLocaleString("vn-VN", { style: "currency", currency: "VND" })}</span>
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
                    >
                      Thêm vào giỏ hàng
                    </Button>
                    {/* <Button className="Card-Button">Mua</Button> */}
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
        <Paginate itemsPerPage={itemsPerPage} totalProduct={totalProduct} product={ActiveProduct} setPaginatedProduct={setPaginatedProduct} filters={filters} />
      </div>
    </>
  );
};

export default ProductCard;
