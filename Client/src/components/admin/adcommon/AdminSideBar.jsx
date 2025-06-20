import { BiCheckCircle, BiUser } from "react-icons/bi";
import { FaProductHunt } from "react-icons/fa";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
export const AdminSideBar = ({ collapse } = props) => {
  return (
    <Sidebar className="sidebar-admin" collapsed={collapse} collapsedWidth="0px">
      <Menu>
        <MenuItem href="/admin">Quản Lí Hệ Thống</MenuItem>
        <SubMenu label="Trang chủ" icon={<BiCheckCircle />}>
          <MenuItem>Pie charts </MenuItem>
          <MenuItem> Line charts </MenuItem>
        </SubMenu>
        <MenuItem icon={<BiUser />} href="/admin/manage-user">
          Quản Lí Người Dùng
        </MenuItem>
        <MenuItem icon={<FaProductHunt />} href="/admin/manage-brand">
          Quản Lí Nhãn Hàng
        </MenuItem>
        <MenuItem icon={<FaProductHunt />} href="/admin/manage-stock">
          Quản Lí Sản Phẩm
        </MenuItem>
        <MenuItem icon={<FaProductHunt />} href="/admin/manage-promotion">
          Quản Lí Phiếu Giảm Giá
        </MenuItem>
      </Menu>
    </Sidebar>
  );
};
