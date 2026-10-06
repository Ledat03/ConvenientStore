import { useState, useEffect } from "react";
import "../../assets/scss/manageorder.scss";
import { deleteImport, viewImport } from "../../services/GetAPI";
import { ButtonGroup, Dropdown, Button } from "react-bootstrap";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaPlus } from "react-icons/fa";
import AddImport from "./manageimport/AddImport";
import UpdateImport from "./manageimport/UpdateImport";
import DeleteImport from "./manageimport/DeleteImport";
import Pageable from "../common/Pageable";
import AdminDataTable from "./common/AdminDataTable";
import { toast } from "react-toastify";
const ManageImport = () => {
  const [ListImport, setListImport] = useState({ data: [], total: 0 });
  const [isActive, setActive] = useState({
    addImport: false,
    Detail: false,
    updateImport: false,
    deleteImport: false,
  });
  console.log(ListImport)
  const [selectedImport, setSelectedImport] = useState();
  const [filters, setFilters] = useState({
    days: 0,
    code: null,
    page: 0
  });
  const [tempFilters, setTempFilters] = useState({
    days: 0,
    code: null,
    page: 0
  });
  useEffect(() => {
    getListImport(filters);
  }, [filters]);
  const getListImport = async (filter) => {
    const res = await viewImport(filter);
    setListImport({ data: res.data.data, total: res.data.totalItems });
  };

  const detailsTotal = (importItem) =>
    importItem.inventoryImportDetails.reduce((detailSum, item) => {
      return detailSum + (item.total_cost || 0);
    }, 0);

  const importColumns = [
    {
      key: "importId",
      title: "ID",
      render: (item) => <span className="order-id">{item.importId}</span>,
    },
    {
      key: "importDate",
      title: "Import Date",
      render: (item) => <span className="order-date">{item.importDate ? new Date(item.importDate).toLocaleDateString("vi-VN") : ""}</span>,
    },
    {
      key: "importCode",
      title: "Import Code",
      render: (item) => (
        <div className="customer-info">
          <span className="customer-name">{item.importCode}</span>
        </div>
      ),
    },
    {
      key: "username",
      title: "Importer",
      render: (item) => (
        <div className="customer-info">
          <span className="customer-name">{item.username}</span>
        </div>
      ),
    },
    {
      key: "total",
      title: "Total",
      render: (item) => (
        <div className="customer-info">
          <span className="customer-name">{detailsTotal(item).toLocaleString("vi-VN")}VNĐ</span>
        </div>
      ),
    },
  ];

  const renderImportActions = (item) => (
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
  );

  const handleBulkDelete = async (importIds) => {
    try {
      await Promise.all(importIds.map((id) => deleteImport(id)));
      await getListImport(filters);
      toast.success("Xóa các phiếu nhập đã chọn thành công");
    } catch (error) {
      toast.error("Xóa phiếu nhập thất bại");
      throw error;
    }
  };
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
          <input type="text" placeholder="Search Information" value={tempFilters.code} onChange={(e) => setTempFilters({ ...tempFilters, code: e.target.value })} className="search-input" />
          <span className="search-icon"></span>
        </div>
          <select value={tempFilters.days} onChange={(e) => setTempFilters({ ...tempFilters, days: e.target.value })} className="time-filter">
            <option value={0}>Import Time</option>
            <option value={30}>Last 30 days</option>
            <option value={7}>Last 7 days</option>
            <option value={206}>Last 90 days</option>
          </select>
          <button className="controls-right__search" onClick={() => {
            setFilters(tempFilters);
          }}>Search</button>
          <button className="controls-right__clear" onClick={() => {
            setTempFilters({
              time: 0,
              search: null,
              page: 0
            })
            setFilters({
              time: 0,
              search: null,
              page: 0
            })
          }}>Clear</button>
        </div>
        {console.log(tempFilters)}
      </div>
      <div className="table-container">
        <AdminDataTable
          columns={importColumns}
          data={ListImport.data}
          rowKey={(item) => item.importId}
          onRowClick={(item) => {
            setSelectedImport(item);
            setActive({ ...isActive, Detail: true });
          }}
          renderActions={renderImportActions}
          onBulkDelete={handleBulkDelete}
          emptyText="Không có phiếu nhập nào"
        />
        <div className="pagination-container">
          <Pageable total={ListImport.total} currentPage={filters.page} pageChange={setFilters} />
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
