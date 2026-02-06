import { useState } from "react";
import { Dropdown, ButtonGroup } from "react-bootstrap";
import { BsThreeDotsVertical } from "react-icons/bs";
import AddPromotion from "./AddPromotion";
import UpdatePromotion from "./UpdatePromotion";
import ViewPromotion from "./ViewPromotion";
import "../css/productCustom.scss";
import DeletePromotion from "./DeletePromotion";
import Paginate from "../../common/Paginate";
const TablePromotion = ({ InfoPromotion, handlePromotionList, categories, subCategories, brands, products }) => {
  const [HandlePromotion, setState] = useState({
    ProView: false,
    ProUpdate: false,
    ProDelete: false,
    ProFilter: false
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
  return (
    <div className="product-list-container">
      <nav className="breadcrumb">
        <a href="#" className="breadcrumb-link">
          Dashboard
        </a>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">Promotion</span>
      </nav>

      <div className="product-list-header">
        <h1 className="page-title">Promotion List</h1>
      </div>

      <div className="product-list-filters">
        <div className="filters-left">
          <AddPromotion handlePromotionList={handlePromotionList} categories={categories} subCategories={subCategories} brands={brands} products={products} />

        </div>

        {HandlePromotion.ProFilter ? <div className="filters-right">
          <button onClick={() => setState(prev => ({ ...prev, ProFilter: false }))}>X</button>
          <div className="search-container">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input type="text" placeholder="Search Promotion " className="search-input" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
          </div>
          <select className="filter-select" value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
            <option value="Default">Promotion For</option>
            <option value="ALL">For All Products</option>
            <option value="PRODUCT">For Specified Product </option>
            <option value="CATEGORY">For Specified Category</option>
            <option value="BRAND">For Specified Brand</option>
          </select>

          <select className="filter-select" value={filters.reduce} onChange={(e) => setFilters({ ...filters, reduce: e.target.value })}>
            <option value="Default">Promotion Type</option>
            <option value="PERCENTAGE">Reduce By %</option>
            <option value="FIXED_AMOUNT">Reduce By Fixed Amount</option>
          </select>

          <select className="filter-select" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="Default">Status</option>
            <option value="true">Valid</option>
            <option value="false">Expired</option>
          </select>
          <button >Search</button>
          <button>Clear</button>
        </div> : <button onClick={() => setState(prev => ({ ...prev, ProFilter: true }))}>Filter</button>}
      </div>
      <div className="product-table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th className="table-header">
                <input type="checkbox" className="checkbox" />
              </th>
              <th className="table-header">Name</th>
              <th className="table-header name-header">Code</th>
              <th className="table-header">Expire At</th>
              <th className="table-header">Status</th>
              <th className="table-header">Type</th>
            </tr>
          </thead>
          <tbody>
            {InfoPromotion.map((promotion) => (
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
                  <span className={`${promotion.active ? "active" : "disabled"}`}>{promotion.active ? "Valid" : "Expired"}</span>
                </td>

                <td className="table-cell">{promotion.scope}</td>
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
                        Information
                      </Dropdown.Item>

                      <Dropdown.Item
                        onClick={() => {
                          handlePromotion(promotion);
                          openModal("ProUpdate");
                        }}
                      >
                        Update
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          handlePromotion(promotion);
                          openModal("ProDelete");
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
        <div className="pagination-container">

        </div>
      </div>
      <>
        <UpdatePromotion isShowUpdate={HandlePromotion.ProUpdate} closeUpdate={() => closeModal("ProUpdate")} InfoItem={InfoItem} categories={categories} subCategories={subCategories} brands={brands} products={products} handlePromotionList={handlePromotionList} />
        <ViewPromotion isShowView={HandlePromotion.ProView} closeView={() => closeModal("ProView")} InfoItem={InfoItem} />
        <DeletePromotion isShowDelete={HandlePromotion.ProDelete} closeDelete={() => closeModal("ProDelete")} InfoItem={InfoItem} handlePromotionList={handlePromotionList} />
      </>
    </div>
  );
};

export default TablePromotion;
