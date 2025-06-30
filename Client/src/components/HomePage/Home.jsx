import Notification from "./Notification";
import QuickCategory from "./QuickCategory";
import BestDeal from "./BestDeal";
import BestSeller from "./BestSeller";
import NewProduct from "./NewProduct";
import Promotion from "./Promotion";
import ChatbotWidget from "./ChatbotWidget";
import { getMainPage } from "../../services/UserSevice";
import { AddToCart } from "../../services/UserSevice";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { useState, useEffect } from "react";
export const Home = (props) => {
  const [Product, setProduct] = useState([]);
  const fetchListProduct = async () => {
    const res = await getMainPage();
    setProduct(res.data.data);
  };
  const [userData, setUserData] = useState();
  useEffect(() => {
    fetchListProduct();
    handleUser();
  }, []);
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
      category: product.category,
    }))
  );
  const handleAddToCart = async (variantId, productId) => {
    const info = {
      userId: userData.id,
      variantId: variantId,
      productId: productId,
    };
    await AddToCart(info);
    toast.success("Thêm Vào Giỏ Hàng Thành Công");
  };
  const handleUser = () => {
    const data = localStorage.getItem("user");
    setUserData(JSON.parse(data));
  };
  return (
    <>
      <Notification />
      <Promotion />
      <QuickCategory />
      <BestDeal product={flatVariant} handleAddToCart={handleAddToCart} />
      <BestSeller products={flatVariant} handleAddToCart={handleAddToCart} />
      <NewProduct flatVariant={flatVariant} user={userData} handleAddToCart={handleAddToCart} />
      <ChatbotWidget />
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" transition={Bounce} />
    </>
  );
};
