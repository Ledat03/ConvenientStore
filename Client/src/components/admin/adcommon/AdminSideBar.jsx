import { BiCheckCircle, BiUser } from "react-icons/bi";
import { FaProductHunt } from "react-icons/fa";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { TbBrandDatabricks } from "react-icons/tb";
import { RiDiscountPercentFill } from "react-icons/ri";
import { MdBorderColor } from "react-icons/md";
import { GrAnalytics } from "react-icons/gr";
export const AdminSideBar = ({ collapse } = props) => {
  return (
    <Sidebar className="sidebar-admin" collapsed={collapse} collapsedWidth="0px">
      <Menu>
        <MenuItem>Quản Lí Hệ Thống</MenuItem>
        <MenuItem href="/admin" icon={<BiCheckCircle />}>
          Trang Chủ
        </MenuItem>
        <MenuItem icon={<BiUser />} href="/admin/manage-user">
          Quản Lí Người Dùng
        </MenuItem>
        <MenuItem icon={<TbBrandDatabricks />} href="/admin/manage-brand">
          Quản Lí Nhãn Hàng
        </MenuItem>
        <MenuItem icon={<FaProductHunt />} href="/admin/manage-stock">
          Quản Lí Sản Phẩm
        </MenuItem>
        <MenuItem icon={<RiDiscountPercentFill />} href="/admin/manage-promotion">
          Quản Lí Phiếu Giảm Giá
        </MenuItem>
        <MenuItem icon={<MdBorderColor />} href="/admin/manage-order">
          Quản Lí Đơn Hàng
        </MenuItem>
        <MenuItem icon={<GrAnalytics />} href="/admin/manage-import">
          Quản Lí Nhập Hàng
        </MenuItem>
      </Menu>
    </Sidebar>
  );
};
