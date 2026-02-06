import { BiCheckCircle, BiUser } from "react-icons/bi";
import { FaProductHunt } from "react-icons/fa";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { TbBrandDatabricks } from "react-icons/tb";
import { RiDiscountPercentFill } from "react-icons/ri";
import { MdBorderColor } from "react-icons/md";
import { GrAnalytics } from "react-icons/gr";
import Logo from "../../../assets/Winmart.svg";
import { useEffect, useState } from "react";
export const AdminSideBar = ({ collapse } = props) => {
  const [user, setUser] = useState({});
  useEffect(() => {
    if (localStorage.getItem("user")) {
      setUser(JSON.parse(localStorage.getItem("user")));
    }
  }, []);
  return (
    <Sidebar className="sidebar-admin" collapsed={collapse} collapsedWidth="80px">
      <Menu>
        <MenuItem className="admin-logo" active={collapse}>
          {!collapse && <img src={Logo} alt="" />}
        </MenuItem>
        {user.role === "admin" && (
          <MenuItem href="/admin" icon={<BiCheckCircle size={20} />}>
            Trang Chủ
          </MenuItem>
        )}
        {user.role === "admin" && (
          <MenuItem icon={<BiUser size={20} />} href="/admin/manage-user">
            Quản Lí Người Dùng
          </MenuItem>
        )}
        <MenuItem icon={<TbBrandDatabricks size={20} />} href="/admin/manage-brand">
          Quản Lí Nhãn Hàng
        </MenuItem>
        <MenuItem icon={<FaProductHunt size={20} />} href="/admin/manage-stock">
          Quản Lí Sản Phẩm
        </MenuItem>
        {user.role === "admin" && (
          <MenuItem icon={<RiDiscountPercentFill size={20} />} href="/admin/manage-promotion">
            Quản Lí Phiếu Giảm Giá
          </MenuItem>
        )}
        {user.role === "admin" && (
          <MenuItem icon={<MdBorderColor size={20} />} href="/admin/manage-order">
            Quản Lí Đơn Hàng
          </MenuItem>
        )}
        <MenuItem icon={<GrAnalytics size={20} />} href="/admin/manage-import">
          Quản Lí Nhập Hàng
        </MenuItem>
      </Menu>
    </Sidebar>
  );
};
