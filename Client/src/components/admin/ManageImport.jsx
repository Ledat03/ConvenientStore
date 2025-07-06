import { useState, useEffect } from "react";
import "../../assets/scss/manageorder.scss";
import { viewImport } from "../../services/GetAPI";
import { ButtonGroup, Dropdown, Button } from "react-bootstrap";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaPlus } from "react-icons/fa";
import AddImport from "./manageimport/AddImport";
import UpdateImport from "./manageimport/UpdateImport";
const ManageImport = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("Last 30 days");
  const [ListImport, setListImport] = useState([]);
  const [isActive, setActive] = useState({
    addImport: false,
    Detail: false,
    updateImport: false,
    deleteImport: false,
  });
  console.log(ListImport);
  const [selectedImport, setSelectedImport] = useState();
  useEffect(() => {
    getListImport();
  }, []);
  const getListImport = async () => {
    const res = await viewImport();
    setListImport(res.data.data);
  };

  const totalCost = ListImport.reduce((sum, importItem) => {
    const detailsTotal = importItem.inventoryImportDetails.reduce((detailSum, item) => {
      return detailSum + (item.total_cost || 0);
    }, 0);

    return sum + detailsTotal;
  }, 0);
  return (
    <div className="manage-order">
      <div className="header">
        <div className="breadcrumb">
          <span className="breadcrumb-item">Trang chủ</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-item active">Danh sách nhập hàng</span>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">Export</button>
          <button className="btn-secondary">Import</button>
        </div>
      </div>
      <h1 className="page-title">Danh sách nhập hàng</h1>
      <div className="controls">
        <div className="controls-left">
          <div className="search-container">
            <input type="text" placeholder="Tìm kiếm thông tin" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
            <span className="search-icon">🔍</span>
          </div>
          <Button onClick={() => setActive({ ...isActive, addImport: true })}>
            <FaPlus />
          </Button>
        </div>
        <div className="controls-right">
          <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} className="time-filter">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Last 90 days</option>
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
              <th>Ngày nhập hàng</th>
              <th>Mã đơn hàng nhập</th>
              <th>Người nhập hàng</th>
              <th>Tổng tiền</th>
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
                <td className="order-date">{item.importDate ? new Date(item.importDate).toISOString().slice(0, 16) : ""}</td>
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
                    <span className="customer-name">{totalCost}</span>
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
        </table>
      </div>
      <>
        <AddImport isActive={isActive} close={() => setActive({ ...isActive, addImport: false })} />
        <UpdateImport isActive={isActive} close={() => setActive({ ...isActive, updateImport: false })} Import={selectedImport} />
      </>
    </div>
  );
};

export default ManageImport;
