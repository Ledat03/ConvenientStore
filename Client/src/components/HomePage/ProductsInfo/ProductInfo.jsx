import SearchHeader from "./SearchHeader";
import ProductCard from "./ProductCard";
import FilterProducts from "./FilterProducts";
import "../../../assets/scss/productsinfo/productsinfo.scss";
import { useState, useEffect } from "react";
import { getProductByAdvFilter, getFilterData } from "../../../services/GetAPI";
import LoadingAnimation from "../../common/LoadingAnimation";
import { useSearchParams } from "react-router-dom";
import PromotionFilter from "./PromotionFilter";
import logo from "../../../assets/No-product.jpg";
import Pageable from "../../common/Pageable";
const ProductInfo = () => {
  const [searchParams] = useSearchParams();
  const [FilterData, setFilterData] = useState({
    unit: [],
    subCategory: [],
    brand: [],
  })
  const [filters, setFilters] = useState({
    category: searchParams.get("category"),
    subCate: searchParams.get("sub-category"),
    search: searchParams.get("search"),
    promotion: searchParams.get("promotion"),
    unit: [],
    subCategory: [],
    priceRange: ["", ""],
    brand: [],
    page: 0
  });
  const [Product, setProduct] = useState({ data: [], total: 0 });
  const [PageState, setState] = useState({ loading: true });
  const [User, setUser] = useState();
  const getUser = () => {
    if (localStorage.getItem("user")) {
      setUser(JSON.parse(localStorage.getItem("user")));
    }
  };
  const fetchByFilter = async (filter) => {
    const res = await getProductByAdvFilter(filter);
    setProduct({
      data: res.data.data,
      total: res.data.totalItems
    })
    console.log(res)
  }
  console.log(Product)
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };
  const handlePriceChange = (index, value) => {
    setFilters((prev) => {
      const newRange = [...prev.priceRange];
      if (index == "0") {
        newRange[index] = value === "" ? "" : Number(value);
      }
      if (index == "1") {
        newRange[index] = value === "" ? "" : Number(value);
      }
      return {
        ...prev,
        priceRange: newRange,
      };
    });
  }
  console.log(filters)
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
    handleProductList(filters);
    getUser();
  }, [searchParams, filters.page]);
  const handleProductList = async (filter) => {
    try {
      console.log(filter)
      let res;
      let filterData;
      if (filter.category !== null || filter.subCate !== null || filter.search !== null || filter.promotion !== null) {
        res = await getProductByAdvFilter(filter);
        filterData = await getFilterData(filter);
        setFilterData({
          unit: filterData.data.unit,
          subCategory: filterData.data.subCategory,
          brand: filterData.data.brand,
        })
        setProduct({ data: res.data.data, total: res.data.totalItems });
        setState(prev => ({ ...prev, loading: false }));
        setFilters((prev) => (
          {
            ...prev,
            category: filter.category,
            subCate: filter.subCate,
            search: filter.search,
            promotion: filter.promotion
          }
        ));
        console.log("if")
      } else {
        const fetch = {
          category: searchParams.get("category"),
          subCate: searchParams.get("sub-category"),
          search: searchParams.get("search"),
          promotion: searchParams.get("promotion")
        }
        res = await getProductByAdvFilter(fetch);
        filterData = await getFilterData(filter);
        setFilterData({
          unit: filterData.data.unit,
          subCategory: filterData.data.subCategory,
          brand: filterData.data.brand,
        })
        setProduct({ data: res.data.data, total: res.data.totalItems });
        setState(prev => ({ ...prev, loading: false }));
        setFilters((prev) => (
          {
            ...prev,
            category: fetch.category,
            subCate: fetch.subCate,
            search: fetch.search,
            promotion: fetch.promotion
          }
        ));
        console.log("else")
      }

    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      throw error;
    }
  }

  if (PageState.loading) {
    return (
      <div>
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <div className="products-app">
      {Product ? (
        <div className="products-container">
          <SearchHeader product={Product.data} category={filters.category} subCate={filters.subCate} setState={setState} />
          <PromotionFilter category={filters.category} flatVariant={Product.data} promotion User={User} />
          <div className="products-main-content">
            <FilterProducts filterData={FilterData} filters={filters} onFilterChange={handleFilterChange} onValueChange={handlePriceChange} subCate={filters.subCate} fetchByFilter={fetchByFilter} setFilters={setFilters} />
            <div className="product-table">
              <ProductCard Loading={PageState.loading} products={Product.data} filters={filters} onSortChange={onSortChange} />
            </div>
          </div>
          <div className="product-paginate">
            <Pageable total={Product.total} currentPage={filters.page} pageChange={setFilters} />
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
