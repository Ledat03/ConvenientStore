import SearchHeader from "./SearchHeader";
import ProductCard from "./ProductCard";
import FilterProducts from "./FilterProducts";
import "../../../assets/scss/productsinfo/productsinfo.scss";
import { useState, useEffect } from "react";
import { fetchListProduct } from "../../../services/GetAPI";
import LoadingAnimation from "../../common/LoadingAnimation";
const ProductInfo = () => {
  const [filters, setFilters] = useState({
    availability: [],
    sale: [],
    unit: [],
    category: [],
    priceRange: [0, 1000000],
    features: [],
  });
  const [Product, setProduct] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("recommended");
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

  const flatVariant = Product.flatMap((product) =>
    product.productVariant.map((variant) => ({
      ...variant,
      productName: product.productName,
      brand: product.brand,
      subCategory: product.subCategory,
      productId: product.productId,
      image: product.image,
      status: product.status,
      Active: product.isActive,
    }))
  );
  const filterBrand = [...new Set(flatVariant.map((product) => product.brand))];
  const filterSubCategory = [...new Set(flatVariant.map((product) => product.subCategory))];
  const filterStock = [...new Set(flatVariant.map((product) => product.stock))];
  const filterUnit = [...new Set(flatVariant.map((product) => product.calUnit))];
  if (Loading) {
    return (
      <div>
        <LoadingAnimation />
      </div>
    );
  }
  console.log(filters);
  return (
    <div className="products-app">
      <div className="products-container">
        <SearchHeader resultCount={85} sortBy={sortBy} onSortChange={setSortBy} />
        <div className="products-main-content">
          <FilterProducts products={flatVariant} filters={filters} onFilterChange={handleFilterChange} filterBrand={filterBrand} filterStock={filterStock} filterSubCategory={filterSubCategory} filterUnit={filterUnit} />
          <div className="product-table">
            <ProductCard products={flatVariant} filters={filters} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
