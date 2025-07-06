import { UserTable } from "./manageuser/UserTable";
import { handleListUser } from "../../services/GetAPI";
import { useEffect, useState } from "react";
import CreateUser from "./manageuser/CreateUser";
import LoadingAnimation from "../common/LoadingAnimation";
export const AdminManageUser = () => {
  const [Users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    handleUsers();
  }, []);
  const handleUsers = async () => {
    try {
      const listUsers = await handleListUser();
      setUsers(listUsers.data.data);
      setLoading(false);
      setError(null);
    } catch (e) {
      setLoading(false);
      setError(e);
      throw e;
    }
  };
  if (loading) {
    return <LoadingAnimation />;
  }
  if (error != null) {
    return <div>Không thể lấy danh sách người dùng do {error}</div>;
  }
  return (
    <div className="manage-user-container">
      <nav className="breadcrumb">
        <a href="#" className="breadcrumb-link">
          Trang chủ
        </a>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">Sản Phẩm</span>
      </nav>

      <div className="product-list-header">
        <h1 className="page-title">Danh Sách Sản Phẩm</h1>
        <div className="header-buttons">
          <button className="secondary-button">Export</button>
          <button className="secondary-button">Import</button>
        </div>
      </div>
      <div className="product-list-filters">
        <div className="filters-left">
          <CreateUser handleUsers={handleUsers} />
          <div className="search-container">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input type="text" placeholder="Tìm Kiếm Sản Phẩm" className="search-input" />
          </div>

          <div className="date-container">
            <input type="text" value="14 Feb, 24" readOnly className="date-input" />
            <svg className="date-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
        </div>

        <div className="filters-right">
          <select className="filter-select">
            <option value="">Vendor</option>
            <option value="fotobi">Fotobi Furniture</option>
            <option value="mojar">Mojar Furniture</option>
          </select>

          <select className="filter-select">
            <option value="">Tagged With</option>
            <option value="furniture">Furniture</option>
            <option value="chair">Chair</option>
          </select>

          <select className="filter-select">
            <option value="">Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>
      <div className="manage-user-subcontainer"></div>
      <div className="table-user">
        <UserTable handleUsers={handleUsers} Users={Users} />
      </div>
    </div>
  );
};
