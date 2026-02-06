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
import Pageable from "../../common/Pageable";
const TableProduct = ({ InfoProduct, handleProductsList, setInfoProduct, setFilter }) => {
  const [HandleProductState, setState] = useState({
    ProdView: false,
    ProdUpdate: false,
    ProdDelete: false,
    ProdVariant: false,
    ProdFilter: false,
  });
  const [filters, setFilters] = useState({
    status: null,
    state: null,
    name: "",
    page: 0
  });
  console.log(filters)
  const [InfoItem, setInfoItem] = useState({});
  const [ListVariants, setListVariants] = useState([]);

  const openModal = (modalName) => {
    setState((prev) => ({ ...prev, [modalName]: true }));
  };
  const closeModal = (modalName) => {
    setState((prev) => ({ ...prev, [modalName]: false }));
  };

  const handleProduct = (product) => {
    setInfoItem(product);
  };
  const getVariants = async (id) => {
    try {
      const handleVariants = await GetListVariant(id);
      setListVariants(handleVariants.data);
    } catch (error) {
      throw error;
    }
  };
  const clearFilter = () => {
    setFilter({ status: null, state: null, name: null, page: 0 });
    setFilters({ status: null, state: null, name: "", page: 0 });
  }
  return (
    <div className="product-list-container">
      <nav className="breadcrumb">
        <a href="#" className="breadcrumb-link">
          Dashboard
        </a>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">Products</span>
      </nav>


      <div className="product-list-filters">
        <div className="filters-left">
          <AddProduct handleProductsList={handleProductsList} />
        </div>

        {HandleProductState.ProdFilter ? <div className="filters-right">
          <button className="filter-cancel" onClick={() => setState(prev => ({ ...prev, ProdFilter: false }))}>X</button>
          <div className="search-container">
            <input type="text" placeholder="Search Products" className="search-input" value={filters.name} onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value })
            )} />
          </div>

          <select className="filter-select" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="null">All State</option>
            <option value={true}>On Sale</option>
            <option value={false}>Hide</option>
          </select>

          <select className="filter-select" value={filters.state} onChange={(e) => setFilters({ ...filters, state: e.target.value })}>
            <option value="null">All Status</option>
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
            <option value="NotAvailable">Not Available</option>
          </select>
          <div className="filter-submit" onClick={() => {

            setFilter(filters)
          }}>
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </div>
          <button className="filter-clear" onClick={() => clearFilter()}>  <span>Clear</span></button>
        </div> : <div className="filters-right" onClick={() => setState(prev => ({ ...prev, ProdFilter: true }))}><button className="filter-open">Filter</button></div>}
      </div>
      <div className="product-table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th className="table-header">
                <input type="checkbox" className="checkbox" />
              </th>

              <th className="table-header name-header"></th>
              <th className="table-header">Category</th>
              <th className="table-header">Status</th>
              <th className="table-header">Update at</th>
              <th className="table-header">State</th>
            </tr>
          </thead>
          <tbody>
            {
              InfoProduct.data.map((product) => (
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
                    <span>{product.isActive == "true" ? "On Sale" : "Hide"}</span>
                  </td>
                  <td className="table-cell">{new Date(product.updateAt).toLocaleDateString("vi-VN")}</td>
                  <td className="table-cell">
                    {product.status}
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
                          Change Information
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => {
                            openModal("ProdView");
                            handleProduct(product);
                          }}
                        >
                          Information
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
        <Pageable setInfo={setInfoProduct} pageChange={setFilter} total={InfoProduct.totalItems} />
      </div>
      <>
        <UpdateProduct isShowUpdate={HandleProductState.ProdUpdate} closeUpdate={() => closeModal("ProdUpdate")} InfoItem={InfoItem} handleProductsList={handleProductsList} />
        <ViewProduct isShowView={HandleProductState.ProdView} closeView={() => closeModal("ProdView")} InfoItem={InfoItem} />
        <DeleteProduct isShowDelete={HandleProductState.ProdDelete} closeDelete={() => closeModal("ProdDelete")} InfoItem={InfoItem} handleProductsList={handleProductsList} />
        <CustomVariant isShowVariant={HandleProductState.ProdVariant} closeModal={() => closeModal("ProdVariant")} InfoItem={InfoItem} ListVariants={ListVariants} getVariants={getVariants} />
      </>
    </div>
  );
};

export default TableProduct;
