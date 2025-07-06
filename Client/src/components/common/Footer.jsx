import React from "react";
import "../../assets/scss/footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__services">
          <div className="footer__service">
            <div className="footer__service-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <div className="footer__service-text">
              <h4>Thực phẩm tươi mới</h4>
            </div>
          </div>

          <div className="footer__service">
            <div className="footer__service-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </div>
            <div className="footer__service-text">
              <h4>Miễn phí ship 5KM</h4>
            </div>
          </div>

          <div className="footer__service">
            <div className="footer__service-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <div className="footer__service-text">
              <h4>Nhiều mã giảm giá hấp dẫn </h4>
            </div>
          </div>

          <div className="footer__service">
            <div className="footer__service-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <div className="footer__service-text">
              <h4>Giá tốt như giá chợ</h4>
            </div>
          </div>
        </div>

        <div className="footer__main">
          <div className="footer__section">
            <h5 className="footer__section-title">FRUIT & VEGETABLES</h5>
            <ul className="footer__links">
              <li>
                <a href="#">Fresh Vegetables</a>
              </li>
              <li>
                <a href="#">Herbs & Seasonings</a>
              </li>
              <li>
                <a href="#">Fresh Fruits</a>
              </li>
              <li>
                <a href="#">Cuts & Sprouts</a>
              </li>
              <li>
                <a href="#">Exotic Fruits & Veggies</a>
              </li>
              <li>
                <a href="#">Packaged Produce</a>
              </li>
              <li>
                <a href="#">Party Trays</a>
              </li>
            </ul>
          </div>

          <div className="footer__section">
            <h5 className="footer__section-title">BREAKFAST & DAIRY</h5>
            <ul className="footer__links">
              <li>
                <a href="#">Milk & Flavoured Milk</a>
              </li>
              <li>
                <a href="#">Butter and Margarine</a>
              </li>
              <li>
                <a href="#">Cheese</a>
              </li>
              <li>
                <a href="#">Eggs Substitutes</a>
              </li>
              <li>
                <a href="#">Honey</a>
              </li>
              <li>
                <a href="#">Marmalades</a>
              </li>
              <li>
                <a href="#">Sour Cream and Dips</a>
              </li>
              <li>
                <a href="#">Yogurt</a>
              </li>
            </ul>
          </div>

          <div className="footer__section">
            <h5 className="footer__section-title">MEAT & SEAFOOD</h5>
            <ul className="footer__links">
              <li>
                <a href="#">Breakfast Sausage</a>
              </li>
              <li>
                <a href="#">Dinner Sausage</a>
              </li>
              <li>
                <a href="#">Beef</a>
              </li>
              <li>
                <a href="#">Chicken</a>
              </li>
              <li>
                <a href="#">Sliced Deli Meat</a>
              </li>
              <li>
                <a href="#">Shrimp</a>
              </li>
              <li>
                <a href="#">Wild Caught Fillets</a>
              </li>
              <li>
                <a href="#">Crab and Shellfish</a>
              </li>
              <li>
                <a href="#">Farm Raised Fillets</a>
              </li>
            </ul>
          </div>

          <div className="footer__section">
            <h5 className="footer__section-title">BEVERAGES</h5>
            <ul className="footer__links">
              <li>
                <a href="#">Water</a>
              </li>
              <li>
                <a href="#">Sparkling Water</a>
              </li>
              <li>
                <a href="#">Soda & Pop</a>
              </li>
              <li>
                <a href="#">Coffee</a>
              </li>
              <li>
                <a href="#">Milk & Plant-Based Milk</a>
              </li>
              <li>
                <a href="#">Tea & Kombucha</a>
              </li>
              <li>
                <a href="#">Drink Boxes & Pouches</a>
              </li>
              <li>
                <a href="#">Craft Beer</a>
              </li>
              <li>
                <a href="#">Wine</a>
              </li>
            </ul>
          </div>

          <div className="footer__section">
            <h5 className="footer__section-title">BREADS & BAKERY</h5>
            <ul className="footer__links">
              <li>
                <a href="#">Milk and Margarine</a>
              </li>
              <li>
                <a href="#">Butter and Margarine</a>
              </li>
              <li>
                <a href="#">Cheese</a>
              </li>
              <li>
                <a href="#">Cookies</a>
              </li>
              <li>
                <a href="#">Honey</a>
              </li>
              <li>
                <a href="#">Marmalades</a>
              </li>
              <li>
                <a href="#">Sour Cream and Dips</a>
              </li>
              <li>
                <a href="#">Yogurt</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
