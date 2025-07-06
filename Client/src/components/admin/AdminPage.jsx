import { Outlet } from "react-router-dom";
import { AdminSideBar } from "./adcommon/AdminSideBar";
import "./css/AdminCustom.scss";
import { useEffect, useState } from "react";
import { AdminHeader } from "./adcommon/AdminHeader";
import { Bounce, ToastContainer } from "react-toastify";
export const AdminPage = () => {
  const [collapse, setCollapse] = useState(false);
  const [user, setUser] = useState();
  const getUser = () => {
    let temp = JSON.parse(localStorage.getItem("user"));
    setUser(temp);
  };
  useEffect(() => {
    getUser();
  }, []);
  return (
    <div className="admin-container">
      <div className="second-container">
        <div className="filter-admin">
          <AdminSideBar collapse={collapse} />
        </div>
        <div className="main-content-admin">
          <AdminHeader collapse={collapse} setCollapse={setCollapse} user={user} />
          <Outlet />
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" transition={Bounce} />
    </div>
  );
};
