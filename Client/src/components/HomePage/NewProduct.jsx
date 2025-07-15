import React, { useState } from "react";
import "../../assets/scss/BestSeller.scss";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
const NewProduct = (props) => {
  const [viewLimit, setViewLimit] = useState(8);
  const calSavePrice = (salePrice, price) => {
    let sale = ((salePrice - price) / price) * 100;
    return Math.round(sale);
  };
  return (
    <section className="best-sellers">
      <div className="container">
        <div className="best-sellers__header">
          <h2 className="best-sellers__title">Các sản phẩm mới</h2>
          <p className="best-sellers__subtitle">Cùng xem qua các sản phẩm mới với giá đầy hấp dẫn</p>
        </div>
        <div className="best-sellers__grid">
          {props.flatVariant
            .filter((product) => {
              if (product.stock != 0) return true;
            })
            .slice(0, viewLimit)
            .map((item, index) => {
              return (
                <Link to={`products/product/${item.productId}?variant=${item.calUnit}`} className="product-card" key={index}>
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

        <div
          className="best-sellers__footer"
          onClick={() => {
            setViewLimit(viewLimit + 8);
          }}
        >
          Xem Thêm →
        </div>
      </div>
    </section>
  );
};

export default NewProduct;
