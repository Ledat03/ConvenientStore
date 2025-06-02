import { FaRegUser } from "react-icons/fa";
const HomeHeader = () => {
  return (
    <header className="header">
      <div className="header__main">
        <div className="container">
          <div className="header__main-content">
            <div className="header__logo">
              <a href="/">
                <img src="https://ext.same-assets.com/3309198820/1685326235.png" alt="Bacola" />
                <span className="header__tagline">Online Grocery Shopping Center</span>
              </a>
            </div>
            <div className="header__location">
              <button className="header__location-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <div>
                  <span className="header__location-label">Your Location</span>
                  <span className="header__location-text">Select a Location</span>
                </div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </button>
            </div>
            <div className="header__search">
              <div className="header__search-bar">
                <div className="header__search-category">
                  <button className="header__category-btn">
                    <span>ALL CATEGORIES</span>
                    <small>TOTAL 63 PRODUCTS</small>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 10l5 5 5-5z" />
                    </svg>
                  </button>
                </div>
                <input type="text" placeholder="Search for products..." className="header__search-input" />
                <button className="header__search-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="header__login">
              <a href="/login" className="a-login">
                <FaRegUser className="i-user" />
                <span>Login</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
export default HomeHeader;
