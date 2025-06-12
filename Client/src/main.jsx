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
import { MainPage } from "./components/admin/MainPage.jsx";
import ProductPage from "./components/HomePage/ProductDetail/ProductPage.jsx";
import ProductInfo from "./components/HomePage/ProductsInfo/ProductInfo.jsx";
import Cart from "./components/HomePage/Cart.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="/products" element={<ProductInfo />} />
          <Route path="/products/product/:productId" element={<ProductPage />} />
          <Route path="/cart" element={<Cart />} />
        </Route>
        <Route path="/authenticate" element={<Authentication />} />

        <Route path="/admin" element={<AdminPage />}>
          <Route index element={<MainPage />} />
          <Route path="manage-user" element={<AdminManageUser />} />
          <Route path="manage-stock" element={<ManageProduct />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
