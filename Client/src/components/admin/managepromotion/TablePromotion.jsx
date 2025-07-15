import { useState } from "react";
import { Dropdown, ButtonGroup } from "react-bootstrap";
import { BsThreeDotsVertical } from "react-icons/bs";
import AddPromotion from "./AddPromotion";
import UpdatePromotion from "./UpdatePromotion";
import ViewPromotion from "./ViewPromotion";
import "../css/productCustom.scss";
import DeletePromotion from "./DeletePromotion";
import Paginate from "../../common/Paginate";
const TablePromotion = (props) => {
  const [HandlePromotion, setState] = useState({
    ProView: false,
    ProUpdate: false,
    ProDelete: false,
  });

  const openModal = (modalName) => {
    setState((prev) => ({ ...prev, [modalName]: true }));
  };
  const closeModal = (modalName) => {
    setState((prev) => ({ ...prev, [modalName]: false }));
  };
  const [InfoItem, setInfoItem] = useState({});
  const handlePromotion = (promotion) => {
    setInfoItem(promotion);
  };
  const [filters, setFilters] = useState({
    type: "Default",
    reduce: "Default",
    status: "Default",
    search: "",
  });
  const filledProduct = () => {
    return props.InfoPromotion.filter((item) => (filters.type !== "Default" ? item.scope === filters.type : item))
      .filter((item) => (filters.reduce !== "Default" ? item.type === filters.reduce : item))
      .filter((item) => (filters.status !== "Default" ? item.active.toString() === filters.status : item))
      .filter((item) => item.code.toLowerCase().includes(filters.search));
  };
  const filterList = filledProduct();
  const itemsPerPage = 2;
  const totalItem = props.InfoPromotion.length;
  const [PaginatedItem, setPaginatedItem] = useState([]);
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
          Trang chủ
        </a>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">Mã Giảm Giá</span>
      </nav>

      <div className="product-list-header">
        <h1 className="page-title">Danh Sách Mã Giảm Giá</h1>
      </div>

      <div className="product-list-filters">
        <div className="filters-left">
          <AddPromotion handlePromotionList={props.handlePromotionList} categories={props.categories} subCategories={props.subCategories} brands={props.brands} products={props.products} />
          <div className="search-container">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input type="text" placeholder="Tìm Kiếm Mã " className="search-input" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
          </div>
        </div>

        <div className="filters-right">
          <select className="filter-select" value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
            <option value="Default">Loại mã</option>
            <option value="ALL">Giảm giá tất cả sản phẩm </option>
            <option value="PRODUCT">Giảm giá sản phẩm </option>
            <option value="CATEGORY">Giảm giá danh mục</option>
            <option value="BRAND">Giảm giá nhãn hàng</option>
          </select>

          <select className="filter-select" value={filters.reduce} onChange={(e) => setFilters({ ...filters, reduce: e.target.value })}>
            <option value="Default">Lọc với</option>
            <option value="PERCENTAGE">Giảm theo %</option>
            <option value="FIXED_AMOUNT">Giảm giá cố định</option>
          </select>

          <select className="filter-select" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="Default">Trạng thái</option>
            <option value="true">Kích hoạt</option>
            <option value="false">Ẩn</option>
          </select>
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
            {PaginatedItem.map((promotion) => (
              <tr key={promotion.id} className="table-row">
                <td className="table-cell">
                  <input type="checkbox" className="checkbox" />
                </td>
                <td className="table-cell">
                  <div className="product-info">{promotion.name}</div>
                </td>
                <td className="table-cell">
                  <span className="promotion-code">{promotion.code}</span>
                </td>
                <td className="table-cell">
                  <span className="promotion-date">{new Date(promotion.endDate).toLocaleDateString("vi-Vn")}</span>
                </td>

                <td className={`table-cell`}>
                  <span className={`${promotion.active ? "active" : "disabled"}`}>{promotion.active ? "Kích Hoạt" : "Vô Hiệu"}</span>
                </td>

                <td className="table-cell">{getScope(promotion.scope)}</td>
                <td className="table-cell">
                  <Dropdown drop="down">
                    <Dropdown.Toggle as={ButtonGroup} className="action-button">
                      <BsThreeDotsVertical />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() => {
                          handlePromotion(promotion);
                          openModal("ProView");
                        }}
                      >
                        Thông tin
                      </Dropdown.Item>

                      <Dropdown.Item
                        onClick={() => {
                          handlePromotion(promotion);
                          openModal("ProUpdate");
                        }}
                      >
                        Cập nhật
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          handlePromotion(promotion);
                          openModal("ProDelete");
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
        <div className="pagination-container">
          <Paginate itemsPerPage={itemsPerPage} totalItem={totalItem} item={filterList} setPaginatedItem={setPaginatedItem} sortBy={filters} />
        </div>
      </div>
      <>
        <UpdatePromotion isShowUpdate={HandlePromotion.ProUpdate} closeUpdate={() => closeModal("ProUpdate")} InfoItem={InfoItem} categories={props.categories} subCategories={props.subCategories} brands={props.brands} products={props.products} handlePromotionList={props.handlePromotionList} />
        <ViewPromotion isShowView={HandlePromotion.ProView} closeView={() => closeModal("ProView")} InfoItem={InfoItem} />
        <DeletePromotion isShowDelete={HandlePromotion.ProDelete} closeDelete={() => closeModal("ProDelete")} InfoItem={InfoItem} handlePromotionList={props.handlePromotionList} />
      </>
    </div>
  );
};

export default TablePromotion;
