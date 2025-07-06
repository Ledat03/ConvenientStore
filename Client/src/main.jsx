import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Authentication from "./components/auth/Authentication.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./components//HomePage/Home.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { AdminPage } from "./components/admin/AdminPage.jsx";
import { AdminManageUser } from "./components/admin/AdminManageUser.jsx";
import { ManageProduct } from "./components/admin/ManageProduct.jsx";
import MainPage from "./components/admin/MainPage.jsx";
import ProductPage from "./components/HomePage/ProductDetail/ProductPage.jsx";
import ProductInfo from "./components/HomePage/ProductsInfo/ProductInfo.jsx";
import Cart from "./components/HomePage/Cart.jsx";
import ManagePromotion from "./components/admin/ManagePromotion.jsx";
import { ManageBrand } from "./components/admin/ManageBrand.jsx";
import Checkout from "./components/HomePage/Checkout.jsx";
import Thankyou from "./components/HomePage/Thankyou.jsx";
import ScrollPage from "./components/common/ScrollPage.jsx";
import ManageOrder from "./components/admin/ManageOrder.jsx";
import ManageImport from "./components/admin/ManageImport.jsx";
import UserProfile from "./components/HomePage/UserProfile.jsx";
import RePassword from "./components/auth/RePassword.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollPage />
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="/products" element={<ProductInfo />} />
          <Route path="/products/product/:productId" element={<ProductPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/ordercheck" element={<Thankyou />} />
        </Route>
        <Route path="/authenticate" element={<Authentication />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/re-password" element={<RePassword />} />
        <Route path="/admin" element={<AdminPage />}>
          <Route index element={<MainPage />} />
          <Route path="manage-user" element={<AdminManageUser />} />
          <Route path="manage-stock" element={<ManageProduct />} />
          <Route path="manage-brand" element={<ManageBrand />} />
          <Route path="manage-order" element={<ManageOrder />} />
          <Route path="manage-promotion" element={<ManagePromotion />} />
          <Route path="manage-import" element={<ManageImport />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
