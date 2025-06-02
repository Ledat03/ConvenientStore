import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import SignIn from "./components/auth/SignIn.jsx";
import { SignUp } from "./components/auth/SignUp.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./components//HomePage/Home.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { AdminPage } from "./components/admin/AdminPage.jsx";
import { AdminManageUser } from "./components/admin/AdminManageUser.jsx";
import { ManageProduct } from "./components/admin/ManageProduct.jsx";
import { MainPage } from "./components/admin/MainPage.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="login" element={<SignIn />} />
        <Route path="register" element={<SignUp />} />
        <Route path="/admin" element={<AdminPage />}>
          <Route index element={<MainPage />} />
          <Route path="manage-user" element={<AdminManageUser />} />
          <Route path="manage-stock" element={<ManageProduct />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
