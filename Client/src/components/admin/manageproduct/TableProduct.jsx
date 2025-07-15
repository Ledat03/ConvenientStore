import { useState } from "react";
import { Dropdown, ButtonGroup } from "react-bootstrap";
import { BsThreeDotsVertical } from "react-icons/bs";
import AddProduct from "./AddProduct";
import DeleteProduct from "./DeleteProduct";
import UpdateProduct from "./UpdateProduct";
import ViewProduct from "./ViewProduct";
import CustomVariant from "./VariantsProduct/CustomVariant";
import { GetListVariant } from "../../../services/GetAPI";
import "../css/productCustom.scss";
import Paginate from "../../common/Paginate";
const TableProduct = (props) => {
  const [HandleProductState, setState] = useState({
    ProdView: false,
    ProdUpdate: false,
    ProdDelete: false,
    ProdVariant: false,
  });
  const itemsPerPage = 2;
  const [PaginatedProduct, setPaginatedProduct] = useState([]);
  const openModal = (modalName) => {
    setState((prev) => ({ ...prev, [modalName]: true }));
  };
  const closeModal = (modalName) => {
    setState((prev) => ({ ...prev, [modalName]: false }));
  };
  const [InfoItem, setInfoItem] = useState({});
  const [ListVariants, setListVariants] = useState([]);
  const handleProduct = (product) => {
    setInfoItem(product);
  };
  const productsLength = props.InfoProduct.length;
  const getVariants = async (id) => {
    try {
      const handleVariants = await GetListVariant(id);
      setListVariants(handleVariants.data.data);
    } catch (error) {
      throw error;
    }
  };
  const [filters, setFilters] = useState({
    status: "Default",
    state: "Default",
    search: "",
  });
  const filledProduct = () => {
    return props.InfoProduct.filter((item) => (filters.status !== "Default" ? item.isActive === filters.status : item))
      .filter((item) => (filters.state !== "Default" ? item.status === filters.state : item))
      .filter((item) => item.productName.toLowerCase().includes(filters.search));
  };
  const filterList = filledProduct();
  return (
    <div className="product-list-container">
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
        </div>
      </div>

      <div className="product-list-filters">
        <div className="filters-left">
          <AddProduct handleProductsList={props.handleProductsList} />
          <div className="search-container">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input type="text" placeholder="Tìm Kiếm Sản Phẩm" className="search-input" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
          </div>
        </div>

        <div className="filters-right">
          <select className="filter-select" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="Default">Trang thái</option>
            <option value="true">Hiển Thị</option>
            <option value="false">Ẩn</option>
          </select>

          <select className="filter-select" value={filters.state} onChange={(e) => setFilters({ ...filters, state: e.target.value })}>
            <option value="Default">Tình trạng</option>
            <option value="Draft">Đang Chỉnh Sửa</option>
            <option value="Published">Đang Bán</option>
            <option value="NotAvailable">Ngừng Kinh Doanh</option>
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

              <th className="table-header name-header"></th>
              <th className="table-header">Loại</th>
              <th className="table-header">Trạng thái</th>
              <th className="table-header">Cập nhật vào</th>
              <th className="table-header">Tình trạng</th>
            </tr>
          </thead>
          <tbody>
            {PaginatedProduct.map((product) => (
              <tr key={product.productId} className="table-row">
                <td className="table-cell">
                  <input type="checkbox" className="checkbox" />
                </td>
                <td className="table-cell">
                  <div className="product-info" style={{ marginLeft: "30px" }}>
                    {product.image ? <img src={product.image} alt={product.name} className="product-image" /> : ""}
                    {product.productName}
                  </div>
                </td>
                <td className="table-cell">{product.category}</td>

                <td className="table-cell">
                  <span>{product.isActive == "true" ? "Hiển Thị" : "Đang Ẩn"}</span>
                </td>
                <td className="table-cell">{new Date(product.updateAt).toLocaleDateString("vi-VN")}</td>
                <td className="table-cell">
                  {product.status == "Draft" && "Chưa hoàn thành"}
                  {product.status == "Published" && "Đang bán"}
                  {product.status == "NotAvailable" && "Ngừng kinh doanh"}
                </td>
                <td className="table-cell">
                  <Dropdown drop="down">
                    <Dropdown.Toggle as={ButtonGroup} className="action-button">
                      <BsThreeDotsVertical />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() => {
                          openModal("ProdVariant");
                          handleProduct(product);
                          getVariants(product.productId);
                        }}
                      >
                        Chỉnh sửa thông tin
                      </Dropdown.Item>
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
        <div className="pagination-container">
          <Paginate itemsPerPage={itemsPerPage} totalItem={productsLength} item={filterList} setPaginatedItem={setPaginatedProduct} sortBy={filters} />
        </div>
      </div>
      <>
        <UpdateProduct isShowUpdate={HandleProductState.ProdUpdate} closeUpdate={() => closeModal("ProdUpdate")} InfoItem={InfoItem} handleProductsList={props.handleProductsList} />
        <ViewProduct isShowView={HandleProductState.ProdView} closeView={() => closeModal("ProdView")} InfoItem={InfoItem} />
        <DeleteProduct isShowDelete={HandleProductState.ProdDelete} closeDelete={() => closeModal("ProdDelete")} InfoItem={InfoItem} handleProductsList={props.handleProductsList} />
        <CustomVariant isShowVariant={HandleProductState.ProdVariant} closeModal={() => closeModal("ProdVariant")} InfoItem={InfoItem} ListVariants={ListVariants} getVariants={getVariants} />
      </>
    </div>
  );
};

export default TableProduct;
