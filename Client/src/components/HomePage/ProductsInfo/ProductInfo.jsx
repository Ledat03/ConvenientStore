import SearchHeader from "./SearchHeader";
import ProductCard from "./ProductCard";
import FilterProducts from "./FilterProducts";
import "../../../assets/scss/productsinfo/productsinfo.scss";
import { useState, useEffect } from "react";
import { fetchListProduct, fetchListPromotionByFilter } from "../../../services/GetAPI";
import LoadingAnimation from "../../common/LoadingAnimation";
import { useSearchParams } from "react-router-dom";
import PromotionFilter from "./PromotionFilter";
const ProductInfo = () => {
  const [filters, setFilters] = useState({
    availability: [],
    sale: [],
    unit: [],
    category: [],
    priceRange: [0, 1000000],
    brand: [],
  });
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const subCate = searchParams.get("sub-category");
  const promotion = searchParams.get("promotion");
  const [Promo, setPromo] = useState({});
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
    setLoading(true);
    handleProductList();
  }, [category, subCate]);
  const handleProductList = async () => {
    try {
      const res = await fetchListProduct(category, subCate, promotion);
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
  return (
    <div className="products-app">
      <div className="products-container">
        <SearchHeader product={flatVariant} category={category} subCate={subCate} sortBy={sortBy} onSortChange={setSortBy} />
        <PromotionFilter category={category} flatVariant={flatVariant} filterBrand={filterBrand} promotion />
        <div className="products-main-content">
          <FilterProducts products={flatVariant} filters={filters} onFilterChange={handleFilterChange} filterBrand={filterBrand} filterStock={filterStock} filterSubCategory={filterSubCategory} filterUnit={filterUnit} subCate={subCate} />
          <div className="product-table">
            <ProductCard Loading={Loading} products={flatVariant} filters={filters} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
