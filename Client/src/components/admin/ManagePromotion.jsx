import { useEffect, useState } from "react";
import TablePromotion from "./managepromotion/TablePromotion";
import { fetchListPromotion, handleCategories, handleListSubCate, viewBrand, getAllProducts } from "../../services/GetAPI";
import LoadingAnimation from "../common/LoadingAnimation";
const ManagePromotion = () => {
  const [InfoPromotion, setInfoPromotion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  console.log()
  useEffect(() => {
    handlePromotionList();
    loadInitialData();
  }, []);
  const handlePromotionList = async () => {
    let response = await fetchListPromotion();
    console.log(response.data)
    setInfoPromotion(response.data);
    setLoading(false);
  };
  const loadInitialData = async () => {
    setLoading(true);
    try {
      await getListCategories();
      await getListSubCategories();
      await getListProducts();
      await getListBrands();
    } catch (error) {
      toast.error("Error fetch all data");
    }
    setLoading(false);
  };
  const getListCategories = async () => {
    try {
      const response = await handleCategories();
      setCategories(response.data);
      console.log(response)
    } catch (error) {
      console.error("Error fetch category data : ", error);
    }
  };
  const getListSubCategories = async () => {
    try {
      const response = await handleListSubCate();
      setSubCategories(response.data);
      console.log(response)
    } catch (error) {
      console.error("Error fetch subCategory", error);
    }
  };
  const getListProducts = async () => {
    try {
      const response = await getAllProducts();
      console.log(response)
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetch product", error);
    }
  };
  const getListBrands = async () => {
    try {
      const response = await viewBrand();
      setBrands(response.data);
      console.log(response)
    } catch (error) {
      console.error("Error fetch brand:", error);
    }
  };
  if (loading) {
    return <LoadingAnimation />;
  }
  if (error != null) {
    return <div>{error}</div>;
  }
  return (
    <>
      <div className="manage-product-container">
        <div className="manage-product-subcontainer body">
          <TablePromotion InfoPromotion={InfoPromotion} handlePromotionList={handlePromotionList} categories={categories} subCategories={subCategories} brands={brands} products={products} />
        </div>
      </div>
    </>
  );
};
export default ManagePromotion;
