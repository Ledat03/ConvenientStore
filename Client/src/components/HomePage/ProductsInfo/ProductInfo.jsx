import SearchHeader from "./SearchHeader";
import ProductCard from "./ProductCard";
import FilterProducts from "./FilterProducts";
import "../../../assets/scss/productsinfo/productsinfo.scss";
import { useState, useEffect } from "react";
import { fetchListProduct } from "../../../services/GetAPI";
import LoadingAnimation from "../../common/LoadingAnimation";
import { useSearchParams } from "react-router-dom";
import PromotionFilter from "./PromotionFilter";
import logo from "../../../assets/No-product.jpg";
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
  const Search = searchParams.get("search");
  const promotion = searchParams.get("promotion");
  const [Product, setProduct] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("recommended");
  const [User, setUser] = useState();
  const getUser = () => {
    if (localStorage.getItem("user")) {
      setUser(JSON.parse(localStorage.getItem("user")));
    }
  };
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };
  const onSortChange = (product, sortBy) => {
    const sortProduct = [...product];
    switch (sortBy) {
      case "recommended":
        return sortProduct;
      case "price-low": {
        return sortProduct.sort((a, b) => {
          const priceA = a.salePrice != 0 ? a.salePrice : a.price;
          const priceB = b.salePrice != 0 ? b.salePrice : b.price;
          return priceA - priceB;
        });
      }
      case "price-high": {
        return sortProduct.sort((a, b) => {
          const priceA = a.salePrice != 0 ? a.salePrice : a.price;
          const priceB = b.salePrice != 0 ? b.salePrice : b.price;
          return priceB - priceA;
        });
      }
    }
  };
  useEffect(() => {
    setLoading(true);
    handleProductList();
    getUser();
  }, [category, subCate, Search]);
  const handleProductList = async () => {
    try {
      const res = await fetchListProduct(category, subCate, promotion, Search);
      setProduct(res.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };
  const flatVariant = Product?.flatMap((product) =>
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
  const filterBrand = () => {
    if (flatVariant) return [...new Set(flatVariant.map((product) => product.brand.brandName))];
    return [];
  };
  const filterSubCategory = () => {
    if (flatVariant) return [...new Set(flatVariant.map((product) => product.subCategory.subCategoryName))];
    return [];
  };
  const filterStock = () => {
    if (flatVariant) return [...new Set(flatVariant.map((product) => product.stock))];
    return [];
  };
  const filterUnit = () => {
    if (flatVariant) return [...new Set(flatVariant.map((product) => product.calUnit))];
    return [];
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
      {flatVariant ? (
        <div className="products-container">
          <SearchHeader product={flatVariant} category={category} subCate={subCate} sortBy={sortBy} setSortBy={setSortBy} />
          <PromotionFilter category={category} flatVariant={flatVariant} filterBrand={filterBrand()} promotion User={User} />
          <div className="products-main-content">
            <FilterProducts products={flatVariant} filters={filters} onFilterChange={handleFilterChange} filterBrand={filterBrand()} filterStock={filterStock} filterSubCategory={filterSubCategory()} filterUnit={filterUnit()} subCate={subCate} />
            <div className="product-table">
              <ProductCard Loading={Loading} products={flatVariant} filters={filters} onSortChange={onSortChange} sortBy={sortBy} />
            </div>
          </div>
        </div>
      ) : (
        <div className="No-product">
          <div className="notice">
            <img src={logo} alt="" />
            <h2>Hiện tại không có sản phẩm bạn mong muốn</h2>
            <br />
            <h5>Bạn hãy thử chọn lựa các sản phẩm khác trong cửa hàng </h5>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
