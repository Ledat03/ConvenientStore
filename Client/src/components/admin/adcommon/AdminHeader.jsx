import { VscClose } from "react-icons/vsc";
import { FaBars } from "react-icons/fa";
export const AdminHeader = ({ setCollapse, collapse } = props) => {
  return (
    <header className="admin-header">
      <div className="admin-header">
        <div>{collapse == false ? <VscClose className="i" size="30px" onClick={() => setCollapse(!collapse)} /> : <FaBars className="i" size="20px" onClick={() => setCollapse(!collapse)} />}</div>
        <div className="admin-action"></div>
      </div>
      <div className="admin-header__container">
        <div className="admin-header__search-container">
          <div className="admin-header__search-wrapper">
            <svg className="admin-header__search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input type="text" placeholder="Search" className="admin-header__search-input" />
          </div>
        </div>

        <div className="admin-header__actions">
          <div className="admin-header__language">
            <img src="/placeholder.svg?height=20&width=30" alt="English" className="admin-header__language-flag" />
          </div>

          <button className="admin-header__action-button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </button>

          <button className="admin-header__action-button admin-header__notification-button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
            </svg>
            <span className="admin-header__notification-badge">1</span>
          </button>

          <div className="admin-header__user">
            <img src="/placeholder.svg?height=32&width=32" alt="User" className="admin-header__user-avatar" />
          </div>
        </div>
      </div>
    </header>
  );
};
