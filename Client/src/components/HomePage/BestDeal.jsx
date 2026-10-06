import { useState, useRef } from "react";
import "../../assets/scss/home.scss";
import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
const BestDeal = (props) => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    const scrollAmount = 320;
    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
    setTimeout(() => {
      updateScrollButtons();
    }, 300);
  };
  const calSavePrice = (salePrice, price) => {
    let sale = ((salePrice - price) / price) * 100;
    return Math.round(sale);
  };

  const saleProduct = props.product.filter((item) => item.salePrice != 0);
  const updateScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth,
      );
    }
  };

  const handleScroll = () => {
    updateScrollButtons();
  };
  return (
    <>
      <div className="promotion-container">
        <h2 className="Header-text">
          <strong>CÁC SẢN PHẨM ĐANG ĐƯỢC GIẢM GIÁ</strong>
        </h2>
        <div className="promotion-layout">
          <button
            className={`scroll-btn scroll-btn-left ${!canScrollLeft ? "disabled" : ""}`}
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="promotion-wrapper">
            <div
              className="promotion-scroll-container"
              ref={scrollContainerRef}
              onScroll={handleScroll}
            >
              {saleProduct
                .filter((product) => product.stock != 0)
                .filter((product) => product.Active == "true")
                .map((item, index) => {
                  return (
                    <Link
                      to={`products/product/${item.productId}?variant=${item.calUnit}`}
                      className="product-card-sale"
                      key={index}
                    >
                      {item.stock && (
                        <div
                          className={`product-card-sale__badge ${item.stock != 0 ? "product-card-sale__badge--low-stock" : "product-card-sale__badge--out-stock"}`}
                        >
                          {item.stock > 0 ? "Còn Hàng" : "Hết Hàng"}
                        </div>
                      )}
                      <div className="product-card-sale__image-container">
                        <img
                          src={
                            item.productImage[0] ||
                            "/placeholder.svg?height=200&width=200"
                          }
                          alt={item.productName}
                          className="product-card-sale__image"
                        />
                      </div>
                      <div className="product-card-sale__info">
                        <h3 className="product-card-sale__name">
                          {item.productName}
                        </h3>
                        <div className="product-card-sale__tags">
                          <span className="product-card-sale__tag">
                            {item.subCategory}
                          </span>
                          <span className="product-card-sale__tag">
                            {item.brand}
                          </span>
                          <span className="product-card-sale__tag">
                            {item.calUnit}
                          </span>
                        </div>

                        {item.salePrice != 0 ? (
                          <div className="product-card-sale__pricing">
                            <span className="product-card-sale__current-price">
                              {item.salePrice.toLocaleString("vn-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </span>
                            <span className="product-card-sale__original-price">
                              {item.price.toLocaleString("vn-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </span>
                            <span className="product-card-sale__discount">
                              Save {calSavePrice(item.price, item.salePrice)}%
                            </span>
                          </div>
                        ) : (
                          <div className="product-card-sale__pricing">
                            <span className="product-card-sale__current-price">
                              {item.price.toLocaleString("vn-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </span>
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
          </div>

          <button
            className={`scroll-btn scroll-btn-right ${!canScrollRight ? "disabled" : ""}`}
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default BestDeal;
