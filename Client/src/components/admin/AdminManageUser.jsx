import { UserTable } from "./manageuser/UserTable";
import { handleListUser } from "../../services/GetAPI";
import { useEffect, useState } from "react";
import CreateUser from "./manageuser/CreateUser";
import LoadingAnimation from "../common/LoadingAnimation";
export const AdminManageUser = () => {
  const [Users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [Filter, setFilter] = useState({ role: "Default", search: "" });
  const [Search, setSearch] = useState("");
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
        <span className="breadcrumb-current">Quản lí người dùng</span>
      </nav>

      <div className="product-list-header">
        <h1 className="page-title">Danh Sách Người Dùng</h1>
        <div className="header-buttons">
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
            <input type="text" placeholder="Nhập Email người dùng" className="search-input" value={Filter.search} onChange={(e) => setFilter({ ...Filter, search: e.target.value })} />
          </div>
        </div>

        <div className="filters-right">
          <select className="filter-select" value={Filter.role} onChange={(e) => setFilter({ ...Filter, role: e.target.value })}>
            <option value="Default">Quyền hạn</option>
            <option value="admin">Quản trị viên</option>
            <option value="employee">Nhân viên</option>
            <option value="user">Người dùng</option>
          </select>
        </div>
      </div>
      <div className="manage-user-subcontainer"></div>
      <div className="table-user">
        <UserTable Filter={Filter} handleUsers={handleUsers} Users={Users} />
      </div>
    </div>
  );
};
