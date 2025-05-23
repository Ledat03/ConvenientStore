import { useState } from "react";
import { Button, Nav, Navbar, NavLink } from "react-bootstrap";
import { BiCheckCircle, BiUser } from "react-icons/bi";
import { FaProductHunt } from "react-icons/fa";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
export const AdminSideBar = ({ collapse } = props) => {
  return (
    <Sidebar
      className="sidebar-admin"
      collapsed={collapse}
      collapsedWidth="0px"
    >
      <Menu>
        <MenuItem href="/admin">Manage System</MenuItem>
        <SubMenu label="Charts" icon={<BiCheckCircle />}>
          <MenuItem>Pie charts </MenuItem>
          <MenuItem> Line charts </MenuItem>
        </SubMenu>
        <MenuItem icon={<BiUser />} href="/admin/manage-user">
          Manage User
        </MenuItem>
        <MenuItem icon={<FaProductHunt />} href="/admin/manage-stock">
          Manage Stock
        </MenuItem>
      </Menu>
    </Sidebar>
  );
};
