import { VscClose } from "react-icons/vsc";
import { FaBars } from "react-icons/fa";
import { fetchLogOut } from "../../../services/AuthAPI";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { Dropdown, DropdownMenu, DropdownToggle } from "react-bootstrap";
export const AdminHeader = ({ setCollapse, collapse, user } = props) => {
  const navigate = useNavigate();
  return (
    <header className="admin-header">
      <div className="admin-header">
        <div>{collapse == false ? <VscClose className="i" size="30px" onClick={() => setCollapse(!collapse)} /> : <FaBars className="i" size="20px" onClick={() => setCollapse(!collapse)} />}</div>
        <div className="admin-action"></div>
      </div>
      <div className="admin-header__container">
        <div className="admin-header__user">
          <Dropdown drop="down">
            <DropdownToggle className="logout_button">
              <FaUserCircle size={30} />
              <span> Xin chào , {user?.name}</span>
            </DropdownToggle>
            <DropdownMenu>
              <Dropdown.Item onClick={() => navigate("/userprofile", { state: { User: user } })}>Thông tin cá nhân</Dropdown.Item>
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
