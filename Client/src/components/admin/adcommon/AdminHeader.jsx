import { VscClose } from "react-icons/vsc";
import { FaBars } from "react-icons/fa";
import { LuUserRound } from "react-icons/lu";
import { fetchLogOut } from "../../../services/AuthAPI";
import { useNavigate } from "react-router-dom";
import { Dropdown, DropdownButton, DropdownMenu, DropdownToggle } from "react-bootstrap";
export const AdminHeader = ({ setCollapse, collapse } = props) => {
  const navigate = useNavigate();
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

        <div className="admin-header__user">
          <Dropdown drop="down">
            <DropdownToggle>
              <LuUserRound />
            </DropdownToggle>
            <DropdownMenu>
              <Dropdown.Item
                onClick={async () => {
                  await fetchLogOut();
                  localStorage.clear();
                  navigate("/");
                }}
              >
                Đăng Xuất
              </Dropdown.Item>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};
