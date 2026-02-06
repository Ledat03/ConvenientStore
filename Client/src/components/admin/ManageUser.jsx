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
      setUsers(listUsers.data);
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
    return <div>Somehing went wrong ! </div>;
  }
  return (
    <div className="manage-user-container">
      <nav className="breadcrumb">
        <a href="#" className="breadcrumb-link">
          Dashboard
        </a>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">Manage User</span>
      </nav>

      <div className="product-list-header">
        <h1 className="page-title">User List</h1>
      </div>
      <div className="product-list-filters">
        <div className="filters-left">
          <CreateUser handleUsers={handleUsers} />

        </div>

        <div className="filters-right">
          <div className="search-container">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input type="text" placeholder="Search" className="search-input" value={Filter.search} onChange={(e) => setFilter({ ...Filter, search: e.target.value })} />
          </div>
          <select className="filter-select" value={Filter.role} onChange={(e) => setFilter({ ...Filter, role: e.target.value })}>
            <option value="Default">Permission</option>
            <option value="admin">Admin</option>
            <option value="employee">Employee</option>
            <option value="user">User</option>
          </select>
          <button>Clear</button>
        </div>

      </div>
      <div className="table-user">
        <UserTable Filter={Filter} handleUsers={handleUsers} Users={Users} />
      </div>
    </div>
  );
};
