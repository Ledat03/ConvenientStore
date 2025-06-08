import SearchHeader from "./SearchHeader";
import ProductCard from "./ProductCard";
import ReactPaginate from "react-paginate";
import FilterProducts from "./FilterProducts";
import "../../../assets/scss/productsinfo/productsinfo.scss";
import { useState, useEffect } from "react";
import { fetchListProduct } from "../../../services/GetAPI";
import LoadingAnimation from "../../common/LoadingAnimation";
const ProductInfo = () => {
  const [filters, setFilters] = useState({
    availability: [],
    sale: [],
    material: [],
    category: [],
    priceRange: [0, 1500],
    features: [],
  });
  const [Product, setProduct] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("recommended");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 1;
  const pageCount = Math.ceil(Product.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentProducts = Product.slice(offset, offset + itemsPerPage);
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  useEffect(() => {
    handleProductList();
  }, []);

  const handleProductList = async () => {
    try {
      const res = await fetchListProduct();
      setProduct(res.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };
  if (Loading) {
    return (
      <div>
        <LoadingAnimation />
      </div>
    );
  }
  return (
    <div className="products-app">
      <div className="products-container">
        <SearchHeader resultCount={85} sortBy={sortBy} onSortChange={setSortBy} />
        <div className="products-main-content">
          <FilterProducts filters={filters} onFilterChange={handleFilterChange} />
          <ProductCard products={Product} />
          <div className="pagination-container">
            <ReactPaginate previousLabel={"← Previous"} nextLabel={"Next →"} pageCount={filteredPageCount} onPageChange={handlePageChange} forcePage={currentPage} containerClassName={"pagination"} previousLinkClassName={"pagination__link"} nextLinkClassName={"pagination__link"} disabledClassName={"pagination__link--disabled"} activeClassName={"pagination__link--active"} pageClassName={"pagination__item"} pageLinkClassName={"pagination__link"} breakClassName={"pagination__break"} marginPagesDisplayed={2} pageRangeDisplayed={5} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
