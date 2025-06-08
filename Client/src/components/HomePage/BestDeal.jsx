import React from "react";
import "../../assets/scss/BestDeal.scss";
import { Link } from "react-router-dom";
const BestDeal = () => {
  const products = [
    {
      id: 1,
      name: "Field Roast Chao Cheese Creamy Original",
      price: "$19.50",
      originalPrice: "$24.00",
      rating: 4,
      reviews: 4,
      image: "https://ext.same-assets.com/3309198820/206076798.jpeg",
      badge: "23%",
    },
    {
      id: 2,
      name: "Chobani Complete Vanilla Greek Yogurt",
      price: "$12.50",
      originalPrice: "$16.00",
      rating: 5,
      reviews: 7,
      image: "https://ext.same-assets.com/3309198820/844568391.jpeg",
      badge: "21%",
    },
    {
      id: 3,
      name: "Encore Seafoods Stuffed Alaskan Salmon",
      price: "$11.50",
      originalPrice: "$15.00",
      rating: 4,
      reviews: 3,
      image: "https://ext.same-assets.com/3309198820/2736726771.jpeg",
      badge: "23%",
    },
    {
      id: 4,
      name: "Haagen-Dazs Caramel Cone Ice Cream",
      price: "$19.50",
      originalPrice: "$24.00",
      rating: 5,
      reviews: 6,
      image: "https://ext.same-assets.com/3309198820/2583476735.jpeg",
      badge: "19%",
    },
    {
      id: 5,
      name: "Nestle Original Coffee-Mate Coffee Creamer",
      price: "$15.30",
      originalPrice: "$18.00",
      rating: 4,
      reviews: 8,
      image: "https://ext.same-assets.com/3309198820/743640295.jpeg",
      badge: "15%",
    },
  ];

  return (
    <section className="special-offers">
      <div className="container">
        <div className="special-offers__header">
          <h2 className="special-offers__title">Deal tốt mỗi tuần</h2>
          <div className="special-offers__timer">
            <div className="timer-item">
              <span className="timer-number">01</span>
              <span className="timer-label">d</span>
            </div>
            <div className="timer-item">
              <span className="timer-number">02</span>
              <span className="timer-label">h</span>
            </div>
            <div className="timer-item">
              <span className="timer-number">03</span>
              <span className="timer-label">m</span>
            </div>
            <div className="timer-item">
              <span className="timer-number">05</span>
              <span className="timer-label">s</span>
            </div>
          </div>
        </div>

        <div className="special-offers__grid">
          {products.map((product) => (
            <Link key={product.id} className="product-card" to="/product-detail">
              <div className="product-card__image-container">
                <img src={product.image} alt={product.name} className="product-card__image" />
                <span className="product-card__badge">-{product.badge}</span>
                <div className="product-card__actions">
                  <button className="product-card__action">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </button>
                  <button className="product-card__action">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 11H7v3h2v-3zm4 0h-2v3h2v-3zm4 0h-2v3h2v-3zm2-7h-2V2h-2v2H9V2H7v2H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="product-card__content">
                <h3 className="product-card__title">{product.name}</h3>

                <div className="product-card__rating">
                  <span className="reviews">({product.reviews})</span>
                </div>

                <div className="product-card__price">
                  <span className="current-price">{product.price}</span>
                  <span className="original-price">{product.originalPrice}</span>
                </div>

                <button className="product-card__add-to-cart">Thêm vào giỏ hàng</button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestDeal;
