import React from "react";
import "../../assets/scss/Notification.scss";
import { useRef, useState, useEffect } from "react";
const Notification = () => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    const scrollAmount = 867;

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
  const listPromotion = [
    { picture: `https://res.cloudinary.com/donwvgcah/image/upload/v1752133103/homepage_lv6so8.jpg`, link: "/" },
    { picture: `https://res.cloudinary.com/donwvgcah/image/upload/v1752133101/homepage_omo_wibfsj.jpg`, link: "/" },
    { picture: `https://res.cloudinary.com/donwvgcah/image/upload/v1752134145/homepage_867x400-20250702133856_vqgnqb.jpg`, link: "/" },
    { picture: `https://res.cloudinary.com/donwvgcah/image/upload/v1752134372/banner_1808x834_v2-copy-20250701095926_k2dmft_c_pad_w_867_h_400_yetohc.jpg`, link: "/" },
  ];
  return (
    <div className="promotion-wrapper">
      <button className={`scroll-btn scroll-btn-left ${!canScrollLeft ? "disabled" : ""}`} onClick={() => scroll("left")} disabled={!canScrollLeft}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="promotion-scroll-container" ref={scrollContainerRef} onScroll={handleScroll}>
        {listPromotion.map((item, index) => {
          return (
            <a href={item.link}>
              <img key={index} src={item.picture} alt="" />
            </a>
          );
        })}
      </div>

      <button className={`scroll-btn scroll-btn-right ${!canScrollRight ? "disabled" : ""}`} onClick={() => scroll("right")} disabled={!canScrollRight}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
};
export default Notification;
