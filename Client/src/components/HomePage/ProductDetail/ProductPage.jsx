import { useEffect, useState } from "react";
import "../../../assets/scss/productdetail/productdetail.scss";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductTabs from "./ProductTabs";
import LoadingAnimation from "../../common/LoadingAnimation";
import RelatedProducts from "./RelatedProducts";
import { fetchProductById, fetchListProduct } from "../../../services/GetAPI";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { ToastContainer, Bounce } from "react-toastify";
const ProductPage = () => {
  const { productId } = useParams();
  const [searchParams] = useSearchParams();
  const calUnit = searchParams.get("variant");
  const [quantity, setQuantity] = useState(1);
  const [Unit, setUnit] = useState(calUnit);
  const [productData, setProduct] = useState({});
  const [Loading, setLoading] = useState(true);
  const [Variant, setVariant] = useState({});
  const [Products, setProducts] = useState([]);
  useEffect(() => {
    fetchProduct();
  }, [productId]);
  const fetchProduct = async () => {
    try {
      const res = await fetchProductById(productId);
      const data = await fetchListProduct();
      setProducts(data.data);
      setProduct(res.data);
      setUnit(calUnit);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };
  const flatVariant = Products?.flatMap((product) =>
    product.productVariant.map((variant) => ({
      ...variant,
      productName: product.productName,
      brand: product.brand,
      subCategory: product.subCategory.subCategoryName,
      productId: product.productId,
      image: product.image,
      status: product.status,
      Active: product.isActive,
      category: product.category,
    }))
  );
  console.log(Products);
  const handleUnit = (unit) => {
    setUnit(unit);
    handleVariant(unit);
  };
  const handleVariant = (Unit) => {
    setVariant(productData.productVariant.find((variant) => variant.calUnit === Unit));
  };
  return (
    <div>
      {Loading ? (
        <div>
          <LoadingAnimation />
        </div>
      ) : (
        <>
          <div className="product-detail">
            {console.log(productData)}
            <div className="product-detail__container">
              <nav className="product-breadcrumb">
                <a href="/" className="product-breadcrumb__link">
                  Home
                </a>
                <span className="product-breadcrumb__separator">/</span>

                <Link to={`/products?category=${productData.category.categoryName}`} className="product-breadcrumb__link">
                  {productData.category.categoryName} - {productData.subCategory.subCategoryName}
                </Link>
                <span className="product-breadcrumb__separator">/</span>

                <span className="product-breadcrumb__current">{productData.productName}</span>
              </nav>
              <div className="product-detail__layout">
                <div className="product-detail__layout-left">
                  <ProductGallery productData={productData} Variant={Variant} Unit={Unit} />
                  <ProductTabs product={productData} Variant={Variant} />
                </div>
                <div className="product-detail__layout-right">
                  <ProductInfo product={productData} quantity={quantity} setQuantity={setQuantity} Unit={Unit} setUnit={handleUnit} />
                </div>
                {console.log(Unit)}
              </div>
              <RelatedProducts product={flatVariant} productData={productData} />
            </div>
          </div>
          <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" transition={Bounce} />
        </>
      )}
    </div>
  );
};

export default ProductPage;
