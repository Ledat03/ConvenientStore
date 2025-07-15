import { useEffect, useState } from "react";
import TablePromotion from "./managepromotion/TablePromotion";
import { fetchListPromotion, handleCategories, handleListSubCate, viewBrand, fetchListProduct } from "../../services/GetAPI";
import LoadingAnimation from "../common/LoadingAnimation";
const ManagePromotion = () => {
  const [InfoPromotion, setInfoPromotion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    handlePromotionList();
    loadInitialData();
  }, []);
  const handlePromotionList = async () => {
    let response = await fetchListPromotion();
    setInfoPromotion(response.data.data);
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
      toast.error("Lỗi khi tải dữ liệu");
    }
    setLoading(false);
  };
  const getListCategories = async () => {
    try {
      const response = await handleCategories();
      setCategories(response.data.data);
    } catch (error) {
      console.error("Lỗi Khi Lấy Thông tin danh mục:", error);
    }
  };
  const getListSubCategories = async () => {
    try {
      const response = await handleListSubCate();
      setSubCategories(response.data.data);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin danh mục nhánh:", error);
    }
  };
  const getListProducts = async () => {
    try {
      const response = await fetchListProduct();
      setProducts(response.data.data);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin sản phẩm:", error);
    }
  };
  const getListBrands = async () => {
    try {
      const response = await viewBrand();
      setBrands(response.data.data);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin hãng sản phẩm:", error);
    }
  };
  if (loading) {
    return <LoadingAnimation />;
  }
  if (error != null) {
    return <div>Không thể hiển thị mã giảm giá do {error}</div>;
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
