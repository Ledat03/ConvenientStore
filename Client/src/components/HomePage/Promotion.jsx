import { useState, useRef, useEffect } from "react";
import "../../assets/scss/home.scss";
import { fetchListPromotion } from "../../services/GetAPI";
import { Link } from "react-router-dom";
const Promotion = () => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [PromotionList, setPromotions] = useState([]);
  useEffect(() => {
    handleListPromotion();
  }, []);
  const handleListPromotion = async () => {
    const res = await fetchListPromotion();
    setPromotions(res.data.data);
  };
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

  const updateScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth);
    }
  };

  const handleScroll = () => {
    updateScrollButtons();
  };

  return (
    <>
      {PromotionList.length > 0 && (
        <div className="promotion-container">
          <h2 className="Header-text">Voucher Giảm Giá Hot</h2>
          <div className="promotion-wrapper">
            <button className={`scroll-btn scroll-btn-left ${!canScrollLeft ? "disabled" : ""}`} onClick={() => scroll("left")} disabled={!canScrollLeft}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="promotion-scroll-container" ref={scrollContainerRef} onScroll={handleScroll}>
              {PromotionList.map((promo) => (
                <div key={promo.id} className="promotion-card">
                  <div className="promotion-left">
                    {promo.type != "PERCENTAGE" ? (
                      <span>
                        <p>Giảm {promo.maxDiscount.toLocaleString("vn-VN", { style: "currency", currency: "VND" })}</p>
                      </span>
                    ) : (
                      <div className="promotion-left__text">
                        <p>Giảm {promo.discountValue} %</p> <span>Tối đa {promo.maxDiscount.toLocaleString("vn-VN", { style: "currency", currency: "VND" })}</span>
                      </div>
                    )}
                  </div>
                  <div className="promotion-right">
                    <div className="promotion-header">
                      <div className="expiry-badge">HSD: {new Date(promo.endDate).toLocaleDateString("vi-Vn")}</div>
                      <h3 className="promotion-title">{promo.name}</h3>
                      <p className="promotion-description">{promo.description}</p>
                    </div>

                    <div className="promotion-footer">
                      <div className="promo-info">
                        <span>Cho đơn tối thiểu {promo.minOrderValue.toLocaleString("vn-VN", { style: "currency", currency: "VND" })}</span>
                        <span className="promo-code">{promo.code}</span>
                      </div>
                      <Link to={`/products?promotion=${promo.code}`} className="get-now-btn">
                        Lấy Ngay
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className={`scroll-btn scroll-btn-right ${!canScrollRight ? "disabled" : ""}`} onClick={() => scroll("right")} disabled={!canScrollRight}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Promotion;
