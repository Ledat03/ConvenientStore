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
    { picture: `https://res.cloudinary.com/donwvgcah/image/upload/v1774862093/photo_2026-03-30_16-14-19_osceul.jpg`, link: "/" },
    { picture: `https://res.cloudinary.com/donwvgcah/image/upload/v1774859459/photo_2026-03-30_15-27-08_cbuddc.jpg`, link: "/" },
    { picture: `https://res.cloudinary.com/donwvgcah/image/upload/v1774862093/photo_2026-03-30_16-14-15_w91zp3.jpg`, link: "/" },
    { picture: `https://res.cloudinary.com/donwvgcah/image/upload/v1774860038/photo_2026-03-30_15-40-10_nsh7c8.jpg`, link: "/" },
  ];
  return (
    <div className="promotion-layout">
      <button className={`scroll-btn scroll-btn-left ${!canScrollLeft ? "disabled" : ""}`} onClick={() => scroll("left")} disabled={!canScrollLeft}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="promotion-wrapper">
        <div className="promotion-scroll-container" ref={scrollContainerRef} onScroll={handleScroll}>
          {listPromotion.map((item, index) => {
            return (
              <a href={item.link} key={index}>
                <img className="thump" src={item.picture} alt="" />
              </a>
            );
          })}
        </div>
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
