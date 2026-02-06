import { useState, useEffect } from "react";
import "../../assets/scss/manageorder.scss";
import { viewImport } from "../../services/GetAPI";
import { ButtonGroup, Dropdown, Button } from "react-bootstrap";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaPlus } from "react-icons/fa";
import AddImport from "./manageimport/AddImport";
import UpdateImport from "./manageimport/UpdateImport";
import DeleteImport from "./manageimport/DeleteImport";
import Paginate from "../common/Paginate";
const ManageImport = () => {
  const [ListImport, setListImport] = useState([]);
  const [isActive, setActive] = useState({
    addImport: false,
    Detail: false,
    updateImport: false,
    deleteImport: false,
  });
  const itemsPerPage = 6;
  const totalItem = ListImport.length;
  const [PaginatedItem, setPaginatedItem] = useState([]);
  const [selectedImport, setSelectedImport] = useState();
  const [filters, setFilters] = useState({
    time: "Default",
    reduce: "Default",
    status: "Default",
    search: "",
  });
  const filledProduct = () => {
    const now = new Date();
    return ListImport.filter((item) => {
      if (filters.time !== "Default") {
        const importDate = new Date(item.importDate);
        const diffInDays = (now - importDate) / (1000 * 60 * 60 * 24);
        return diffInDays <= parseInt(filters.time);
      }
      return true;
    }).filter((item) => item.importCode.toLowerCase().includes(filters.search));
  };
  const filterList = filledProduct();
  useEffect(() => {
    getListImport();
  }, []);
  const getListImport = async () => {
    const res = await viewImport();
    setListImport(res.data);
  };

  const detailsTotal = (importItem) =>
    importItem.inventoryImportDetails.reduce((detailSum, item) => {
      return detailSum + (item.total_cost || 0);
    }, 0);
  return (
    <div className="manage-order">
      <div className="header">
        <div className="breadcrumb">
          <span className="breadcrumb-item">Dashboard</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-item active">Manage Import</span>
        </div>
      </div>
      <h1 className="page-title">Manage Import</h1>
      <div className="controls">
        <div className="controls-left">

          <Button onClick={() => setActive({ ...isActive, addImport: true })}>
            <FaPlus />
          </Button>
        </div>
        <div className="controls-right"> <div className="search-container">
          <input type="text" placeholder="Search Information" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} className="search-input" />
          <span className="search-icon">🔍</span>
        </div>
          <select value={filters.time} onChange={(e) => setFilters({ ...filters, time: e.target.value })} className="time-filter">
            <option value="Default">Import Time</option>
            <option value={30}>Last 30 days</option>
            <option value={7}>Last 7 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>
      </div>
      <div className="table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>
                <input type="checkbox" />
              </th>
              <th>ID</th>
              <th>Import Date</th>
              <th>Import Code</th>
              <th>Importer</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {ListImport.map((item, index) => (
              <tr
                key={index}
                onClick={() => {
                  setSelectedImport(item);
                  setActive({ ...isActive, Detail: true });
                }}
              >
                <td>
                  <input type="checkbox" />
                </td>
                <td className="order-id">{item.importId}</td>
                <td className="order-date">{item.importDate ? new Date(item.importDate).toLocaleDateString("vi-VN") : ""}</td>
                <td className="customer">
                  <div className="customer-info">
                    <span className="customer-name">{item.importCode}</span>
                  </div>
                </td>
                <td className="customer">
                  <div className="customer-info">
                    <span className="customer-name">{item.username}</span>
                  </div>
                </td>
                <td className="customer">
                  <div className="customer-info">
                    <span className="customer-name">{detailsTotal(item).toLocaleString("vi-VN")}VNĐ</span>
                  </div>
                </td>
                <td>
                  <Dropdown
                    className="btn-menu custom-dropdown"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    drop="start"
                  >
                    <Dropdown.Toggle as={ButtonGroup} split>
                      <HiOutlineDotsHorizontal />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() => {
                          setSelectedImport(item);
                          setActive({ ...isActive, updateImport: true });
                        }}
                      >
                        Cập nhật thông tin
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setSelectedImport(item);
                          setActive({ ...isActive, deleteImport: true });
                        }}
                      >
                        Xóa
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </table>{" "}
        <div className="pagination-container">
          {/* <Paginate itemsPerPage={itemsPerPage} totalItem={totalItem} item={filterList} setPaginatedItem={setPaginatedItem} sortBy={filters} reload={ListImport} /> */}
        </div>
      </div>
      <>
        <AddImport isActive={isActive} close={() => setActive({ ...isActive, addImport: false })} getListImport={getListImport} />
        <UpdateImport isActive={isActive} close={() => setActive({ ...isActive, updateImport: false })} Import={selectedImport} getListImport={getListImport} />
        <DeleteImport isActive={isActive} close={() => setActive({ ...isActive, deleteImport: false })} Import={selectedImport} getListImport={getListImport} />
      </>
    </div>
  );
};

export default ManageImport;
