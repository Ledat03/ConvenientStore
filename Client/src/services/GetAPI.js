import { Await } from "react-router-dom";
import APIsCustomize from "../utils/APIsCustomize";

//User Controller
const createNewUser = async (user) => {
  try {
    const responseData = await APIsCustomize.post("user/create", user, {
      headers: { "Content-Type": "application/json" },
    });
    console.log(responseData);
    return responseData.data;
  } catch (e) {
    console.error("Error >>>", e.message);
    throw e;
  }
};

const handleListUser = async () => await APIsCustomize.get("user/view", { headers: { "Content-Type": "application/json" } });
const handleDeleteUser = async (userData) => await APIsCustomize.delete(`user/delete/${userData}`, { headers: { "Content-Type": "application/json" } });
const handleUpdate = async (Id, Email, Password, FirstName, LastName, UserName, Phone, Address, Role) => {
  let UpdateUser = {
    id: Id,
    email: Email,
    password: Password,
    username: UserName,
    phone: Phone,
    address: Address,
    role: Role,
    firstName: FirstName,
    lastName: LastName,
  };
  try {
    const responseUpdate = await APIsCustomize.put("user/update", UpdateUser, { headers: { "Content-Type": "application/json" } });
    return responseUpdate.data;
  } catch (error) {
    console.log("Update Error >>>>", error);
    throw error;
  }
};

//Product Controller
const handleListSubCate = async () => await APIsCustomize.get("product/view/subCategories", { headers: { "Content-Type": "application/json" } });
const handleCategories = async () => await APIsCustomize.get("product/view/categories", { headers: { "Content-Type": "application/json" } });
const addNewProduct = async (formData) => {
  try {
    await APIsCustomize.post("/product/add", formData, { headers: { "Content-Type": "multipart/form-data" } });
  } catch (error) {
    throw error;
  }
};
const updateProduct = async (Product) => {
  await APIsCustomize.put("product/update", Product, { headers: { "Content-Type": "application/json" } });
};
const fetchListProduct = async (category, subCategory, code, name) => await APIsCustomize.get("/product/view", { params: { category, subCategory, code, name }, headers: { "Content-Type": "application/json" } });
const deleteProduct = async (id) => await APIsCustomize.delete(`/product/delete/${id}`, { headers: { "Content-Type": "application/json" } });
const fetchProductById = async (productId) => await APIsCustomize.get(`/product/view/product-info/${productId}`, { headers: { "Content-Type": "application/json" } });
//Variant Controller

const AddNewVariant = async (formData) => await APIsCustomize.post("/variant/add", formData, { headers: { "Content-Type": "multipart/form-data" } });
const GetListVariant = async (id) => await APIsCustomize.get(`/variant/view/${id}`, { headers: { "Content-Type": "application/json" } });
const deleteVariant = async (id) => await APIsCustomize.delete(`/variant/delete/${id}`, { headers: { "Content-Type": "application/json" } });
const UpdateVariantItem = async (formData) => await APIsCustomize.put(`/variant/update`, formData, { headers: { "Content-Type": "multipart/form-data" } });
//Brand Controller
const addBrand = async (brand) => await APIsCustomize.post("/brand/add", brand, { headers: { "Content-Type": "application/json" } });
const updateBrand = async (brand) => await APIsCustomize.put("/brand/update", brand, { headers: { "Content-Type": "application/json" } });
const deleteBrand = async (brand) => await APIsCustomize.delete("/brand/delete", { params: { brand }, headers: { "Content-Type": "application/json" } });
const viewBrand = async () => await APIsCustomize.get("/brand/view", { headers: { "Content-Type": "application/json" } });
//PromotionController
const addNewPromotion = async (formData) => await APIsCustomize.post("/promotion/add", formData, { headers: { "Content-Type": "application/json" } });
const fetchListPromotion = async () => await APIsCustomize.get("/promotion/view", { headers: { "Content-Type": "application/json" } });
const fetchListPromotionByFilter = async (code) => await APIsCustomize.get("/promotion/filterpromo", { params: { code }, headers: { "Content-Type": "application/json" } });
const updatePromotion = async (promotion) => await APIsCustomize.put("/promotion/update", promotion, { headers: { "Content-Type": "application/json" } });
const deletePromotion = async (id) => await APIsCustomize.delete(`/promotion/delete?id=${id}`);
//OrderController
const fetchListOrder = async () => await APIsCustomize.get("/order/view");
const fetchListOrderById = async (id) => await APIsCustomize.get(`/order/view/id`, { params: { id }, headers: { "Content-Type": "application/json" } });
const updateDelivery = async (delivery) => await APIsCustomize.put("/order/update/delivery", delivery, { headers: { "Content-Type": "application/json" } });
const updatePayment = async (payment) => await APIsCustomize.put("/order/update/payment", payment, { headers: { "Content-Type": "application/json" } });
const deleteOrder = async (id) => await APIsCustomize.delete(`/order/delete?id=${id}`);
//InventoryImport

const addImport = async (inventImport) => await APIsCustomize.post("/import/add", inventImport, { headers: { "Content-Type": "application/json" } });
const viewImport = async () => await APIsCustomize.get("/import/view");
const updateImport = async (inventImport) => await APIsCustomize.put("/import/update", inventImport, { headers: { "Content-Type": "application/json" } });
const deleteImport = async (id) => await APIsCustomize.delete(`/import/delete?id=${id}`, { headers: { "Content-Type": "application/json" } });
export { createNewUser, handleListUser, handleUpdate, handleDeleteUser, handleCategories, handleListSubCate, addNewProduct, fetchListProduct, updateProduct, deleteProduct, AddNewVariant, GetListVariant, deleteVariant, UpdateVariantItem, fetchProductById, addNewPromotion, addBrand, updateBrand, deleteBrand, viewBrand, fetchListPromotion, updatePromotion, fetchListPromotionByFilter, deletePromotion, fetchListOrder, fetchListOrderById, updateDelivery, updatePayment, addImport, viewImport, updateImport, deleteImport, deleteOrder };
