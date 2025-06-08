import React from "react";
import "../../assets/scss/BestSeller.scss";

const BestSeller = () => {
  const products = [
    {
      id: 1,
      name: "All Natural Italian-Style Chicken Meatballs",
      price: "$7.25",
      originalPrice: "$9.35",
      rating: 4,
      reviews: 4,
      image: "https://ext.same-assets.com/3309198820/1304357087.jpeg",
    },
    {
      id: 2,
      name: "Simply Lemonade with Raspberry Juice",
      price: "$7.25",
      originalPrice: "$10.99",
      rating: 4,
      reviews: 4,
      image: "https://ext.same-assets.com/3309198820/2585924285.jpeg",
    },
    {
      id: 3,
      name: "Vital Farms Pasture-Raised Egg Bites Bacon & Cheddar",
      price: "$25.25",
      originalPrice: "$28.56",
      rating: 4,
      reviews: 4,
      image: "https://ext.same-assets.com/3309198820/1678009245.jpeg",
    },
    {
      id: 4,
      name: "Encore Seafoods Stuffed Alaskan Salmon",
      price: "$35.25",
      originalPrice: "$39.50",
      rating: 4,
      reviews: 4,
      image: "https://ext.same-assets.com/3309198820/3652722754.jpeg",
    },
    {
      id: 5,
      name: "Field Roast Chao Cheese Creamy Original",
      price: "$19.50",
      originalPrice: "$24.50",
      rating: 4,
      reviews: 4,
      image: "https://ext.same-assets.com/3309198820/1245162401.jpeg",
    },
    {
      id: 6,
      name: "Foster Farms Takeout Crispy Classic Buffalo Wings",
      price: "$7.25",
      originalPrice: "$14.99",
      rating: 4,
      reviews: 4,
      image: "https://ext.same-assets.com/3309198820/739820441.jpeg",
    },
    {
      id: 7,
      name: "Fresh Organic Broccoli Crowns",
      price: "$4.50",
      originalPrice: "$6.99",
      rating: 4,
      reviews: 4,
      image: "https://ext.same-assets.com/3309198820/250598450.png",
    },
    {
      id: 8,
      name: "Chobani Complete Vanilla Greek Yogurt",
      price: "$5.50",
      originalPrice: "$7.25",
      rating: 4,
      reviews: 4,
      image: "https://ext.same-assets.com/3309198820/198003717.jpeg",
    },
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`star ${index < rating ? "filled" : ""}`}>
        ★
      </span>
    ));
  };

  return (
    <section className="best-sellers">
      <div className="container">
        <div className="best-sellers__header">
          <h2 className="best-sellers__title">Bán chạy nhất trong tháng</h2>
          <p className="best-sellers__subtitle">Đừng bỏ lỡ các sản phẩm có giá tốt trong tháng</p>
          <div className="best-sellers__nav">
            <button className="best-sellers__nav-btn active">Tất cả</button>
            <button className="best-sellers__nav-btn">
              <img src="https://ext.same-assets.com/3309198820/992621224.svg" alt="Breakfast" />
              Bữa Sáng
            </button>
            <button className="best-sellers__nav-btn">
              <img src="https://ext.same-assets.com/3309198820/2686096294.svg" alt="Vegetables" />
              Rau Củ Quả
            </button>
            <button className="best-sellers__nav-btn">
              <img src="https://ext.same-assets.com/3309198820/3285029942.svg" alt="Milk" />
              Sữa
            </button>
            <button className="best-sellers__nav-btn">
              <img src="https://ext.same-assets.com/3309198820/2048985869.svg" alt="Cooking" />
              Nấu Ăn
            </button>
          </div>
        </div>

        <div className="best-sellers__grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-card__image-container">
                <img src={product.image} alt={product.name} className="product-card__image" />
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
                  <div className="stars">{renderStars(product.rating)}</div>
                  <span className="reviews">({product.reviews})</span>
                </div>

                <div className="product-card__price">
                  <span className="current-price">{product.price}</span>
                  <span className="original-price">{product.originalPrice}</span>
                </div>

                <button className="product-card__add-to-cart">Thêm vào giỏ hàng</button>
              </div>
            </div>
          ))}
        </div>

        <div className="best-sellers__footer">
          <a href="#" className="best-sellers__view-all">
            View All →
          </a>
        </div>
      </div>
    </section>
  );
};

export default BestSeller;
