import { FaRegUser, FaCaretDown, FaCaretRight } from "react-icons/fa";
import { fetchLogOut } from "../../services/AuthAPI";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown, ButtonGroup } from "react-bootstrap";
import { useState, useEffect } from "react";
import { handleCategories } from "../../services/GetAPI";
import React from "react";
import Logo from "../../assets/Winmart.svg";
import { FiShoppingCart } from "react-icons/fi";
const HomeHeader = ({ onLogout }) => {
  const [Search, setSearch] = useState(null);
  const navigate = useNavigate();
  const [Category, setCategory] = useState([]);
  const [openIdx, setIdx] = useState(null);
  useEffect(() => {
    fetchCategory();
  }, []);
  const fetchCategory = async () => {
    const res = await handleCategories();
    setCategory(res.data.data);
  };
  const user = JSON.parse(localStorage.getItem("user"));
  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => {
    return (
      <span
        ref={ref}
        onClick={(e) => {
          e.preventDefault();
          onClick(e);
        }}
      >
        {children}
      </span>
    );
  });
  return (
    <header className="header">
      <div className="header__main">
        <div className="container">
          <div className="header__main-content">
            <div className="header__logo">
              <a href="/">
                <img src={Logo} alt="Winmart_Logo" />
              </a>
            </div>

            <div className="header__search">
              <div className="header__search-bar">
                <div className="header__search-category">
                  <Dropdown align="start" className="header__category-btn">
                    <Dropdown.Toggle as={CustomToggle}>
                      <span>DANH MỤC SẢN PHẨM</span>
                      <small>HƠN 100 SẢN PHẨM</small>
                      <FaCaretDown />
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="header__dropdown-Menu">
                      {Category.map((cate, idx) => (
                        <Dropdown
                          drop="end"
                          as={ButtonGroup}
                          key={idx}
                          show={openIdx === idx}
                          className="w-100"
                          onMouseEnter={() => {
                            setIdx(idx);
                          }}
                          onMouseLeave={() => setIdx(null)}
                        >
                          <Dropdown.Toggle variant="link" className="custom-nested-dropdown-toggle dropdown-item" id={`dropdown-nested-${cate.categoryId}`}>
                            <Link to={`/products?category=${cate.categoryName}`}>{cate.categoryName}</Link>

                            <FaCaretRight style={{ marginLeft: "auto" }} />
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="header__dropdown-Submenu">
                            {cate.subCategories.map((item) => (
                              <Dropdown.Item
                                key={item.id}
                                href={item.link}
                                onClick={() => {
                                  navigate(`/products?category=${cate.categoryName}&sub-category=${item.subCategoryName}`);
                                }}
                              >
                                {item.subCategoryName}
                              </Dropdown.Item>
                            ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <input
                  type="text"
                  placeholder="Nhập tên sản phẩm..."
                  className="header__search-input"
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
                <Link to={`/products?search=${Search}`} className="header__search-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                  </svg>
                </Link>
              </div>
            </div>
            {!localStorage.getItem("user") ? (
              <div className="header__login">
                <a href="/authenticate" className="a-login">
                  <FaRegUser className="i-user" />
                  <span>Đăng Nhập</span>
                </a>
              </div>
            ) : (
              <div className="header__action">
                <Link to="/cart" className="header__cart">
                  <FiShoppingCart size={20} className="cart-icon" />
                </Link>
                <Dropdown as={ButtonGroup} className="header__login">
                  <Dropdown.Toggle className="header__infoUser">
                    <FaRegUser className="i-user" />
                    <span>{user.name}</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="dropdown-animate">
                    <Dropdown.Item onClick={() => navigate("/userprofile", { state: { User: user } })}>Thông tin cá nhân</Dropdown.Item>
                    <Dropdown.Item
                      onClick={async () => {
                        const res = await fetchLogOut();
                        localStorage.clear();
                        navigate("/");
                      }}
                    >
                      Đăng Xuất
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default HomeHeader;
