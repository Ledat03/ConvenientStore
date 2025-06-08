import React from "react";
import "../../assets/scss/Notification.scss";
const Notification = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero__content">
          <div className="hero__text">
            <div className="hero__label">DEAL TRONG TUẦN</div>
            <h1 className="hero__title">
              Ngũ Cốc Dinh Dưỡng
              <br />
            </h1>
            <p className="hero__description">Chỉ Trong Tuần Này. Dừng Bỏ Lỡ....</p>
            <div className="hero__price">
              <span className="hero__price-label">CHỈ TỪ</span>
              <span className="hero__price-value">150000Đ</span>
            </div>
            <button className="btn btn-teal hero__cta">MUA NGAY</button>
          </div>
          <div className="hero__image">
            <img src="https://ext.same-assets.com/3309198820/2588056221.jpeg" alt="Delicious Pasta" className="hero__pasta-image" />
            <div className="hero__badge">
              <span className="hero__badge-text">DEAL</span>
              <span className="hero__badge-text">HOT</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Notification;
