import { useState } from "react";
import { Table, Button, DropdownButton, Dropdown, ButtonGroup } from "react-bootstrap";
import { BsThreeDotsVertical } from "react-icons/bs";
import AddPromotion from "./AddPromotion";
import UpdatePromotion from "./UpdatePromotion";
import ViewPromotion from "./ViewPromotion";
import { GetListVariant } from "../../../services/GetAPI";
import "../css/productCustom.scss";
import DeletePromotion from "./DeletePromotion";
const TablePromotion = (props) => {
  const [HandleProductState, setState] = useState({
    ProdView: false,
    ProdUpdate: false,
    ProdDelete: false,
    ProdVariant: false,
  });
  const openModal = (modalName) => {
    setState((prev) => ({ ...prev, [modalName]: true }));
  };
  const closeModal = (modalName) => {
    setState((prev) => ({ ...prev, [modalName]: false }));
  };
  const [InfoItem, setInfoItem] = useState({});
  const handleProduct = (product) => {
    setInfoItem(product);
  };

  const getVariants = async (id) => {
    try {
      const handleVariants = await GetListVariant(id);
      setListVariants(handleVariants.data.data);
    } catch (error) {
      throw error;
    }
  };
  const [filters, setFilters] = useState({
    vendor: "",
    taggedWith: "",
    status: "",
  });
  const getStatusStyle = (status) => {
    switch (status) {
      case true:
        return "status-badge status-active";
      case false:
        return "status-badge status-inactive";
      default:
        return "status-badge";
    }
  };
  const getScope = (status) => {
    switch (status) {
      case "ALL":
        return "Mọi Loại";
      case "CATEGORY":
        return "Loại Sản Phẩm";
      case "SUBCATEGORY":
        return "Nhánh Sản Phẩm";
      case "PRODUCT":
        return "Sản Phẩm";
      case "BRAND":
        return "Nhãn Hàng";
      default:
        return "Đang Cập Nhật";
    }
  };
  return (
    <div className="product-list-container">
      <nav className="breadcrumb">
        <a href="#" className="breadcrumb-link">
          Home
        </a>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">Mã Giảm Giá</span>
      </nav>

      <div className="product-list-header">
        <h1 className="page-title">Danh Sách Mã Giảm Giá</h1>
        <div className="header-buttons">
          <button className="secondary-button">Export</button>
          <button className="secondary-button">Import</button>
        </div>
      </div>

      <div className="product-list-filters">
        <div className="filters-left">
          <AddPromotion handleProductsList={props.handleProductsList} />
          <div className="search-container">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input type="text" placeholder="Tìm Kiếm Mã " className="search-input" />
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
          <select className="filter-select" value={filters.vendor} onChange={(e) => setFilters({ ...filters, vendor: e.target.value })}>
            <option value="">Vendor</option>
            <option value="fotobi">Fotobi Furniture</option>
            <option value="mojar">Mojar Furniture</option>
          </select>

          <select className="filter-select" value={filters.taggedWith} onChange={(e) => setFilters({ ...filters, taggedWith: e.target.value })}>
            <option value="">Tagged With</option>
            <option value="furniture">Furniture</option>
            <option value="chair">Chair</option>
          </select>

          <select className="filter-select" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="draft">Draft</option>
          </select>

          <button className="filter-button-text">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"></polygon>
            </svg>
            Saved
          </button>

          <button className="filter-button-text">More Filters</button>
        </div>
      </div>
      <div className="product-table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th className="table-header">
                <input type="checkbox" className="checkbox" />
              </th>
              <th className="table-header">Tên</th>
              <th className="table-header name-header">Mã Giảm Giá</th>
              <th className="table-header">Hết Hạn Vào</th>
              <th className="table-header">Trạng thái</th>
              <th className="table-header">Đối Tượng</th>
            </tr>
          </thead>
          <tbody>
            {props.InfoPromotion.map((promotion) => (
              <tr key={promotion.id} className="table-row">
                <td className="table-cell">
                  <input type="checkbox" className="checkbox" />
                </td>
                <td className="table-cell">
                  <div className="product-info">
                    <span className="product-name">{promotion.name}</span>
                  </div>
                </td>
                <td className="table-cell">{promotion.code}</td>
                <td className="table-cell">{new Date(promotion.endDate).toLocaleDateString("vi-Vn")}</td>

                <td className="table-cell">
                  <span className={getStatusStyle(promotion.active)}>{promotion.active ? "Đang Kích Hoạt" : "Vô Hiệu"}</span>
                </td>
                {console.log(promotion)}
                <td className="table-cell">{getScope(promotion.scope)}</td>
                <td className="table-cell">
                  <Dropdown drop="down">
                    <Dropdown.Toggle as={ButtonGroup} className="action-button">
                      <BsThreeDotsVertical />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() => {
                          openModal("ProdView");
                          handleProduct(product);
                        }}
                      >
                        Infomation
                      </Dropdown.Item>

                      <Dropdown.Item
                        onClick={() => {
                          openModal("ProdUpdate");
                          handleProduct(product);
                        }}
                      >
                        Update
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          openModal("ProdDelete");
                          handleProduct(product);
                        }}
                      >
                        Delete
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
        <UpdatePromotion isShowUpdate={HandleProductState.ProdUpdate} closeUpdate={() => closeModal("ProdUpdate")} openUpdate={() => openModal("ProdUpdate")} InfoItem={InfoItem} handleProductsList={props.handleProductsList} />
        <ViewPromotion isShowView={HandleProductState.ProdView} closeView={() => closeModal("ProdView")} openView={() => openModal("ProdView")} InfoItem={InfoItem} />
        <DeletePromotion isShowDelete={HandleProductState.ProdDelete} closeDelete={() => closeModal("ProdDelete")} openDelete={() => openModal("ProdDelete")} InfoItem={InfoItem} handleProductsList={props.handleProductsList} />
      </>
    </div>
  );
};

export default TablePromotion;
