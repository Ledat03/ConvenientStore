import { toast } from "react-toastify";
import APIsCustomize from "../utils/APIsCustomize";

//User Controller
const createNewUser = async (Email, Password, FirstName, LastName, UserName, Phone, Address, Role) => {
  let user = {
    email: Email,
    passwordHash: Password,
    firstName: FirstName,
    lastName: LastName,
    username: UserName,
    phone: Phone,
    address: Address,
    role: "user",
  };
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
  console.log(UpdateUser);
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
const fetchListProduct = async () => await APIsCustomize.get("/product/view", { headers: { "Content-Type": "application/json" } });
const deleteProduct = async (id) => await APIsCustomize.delete(`/product/delete/${id}`, { headers: { "Content-Type": "application/json" } });
const fetchProductById = async (productId) => await APIsCustomize.get(`/product/view/product-info/${productId}`, { headers: { "Content-Type": "application/json" } });
//Variant Controller

const AddNewVariant = async (formData) => await APIsCustomize.post("/variant/add", formData, { headers: { "Content-Type": "multipart/form-data" } });
const GetListVariant = async (id) => await APIsCustomize.get(`/variant/view/${id}`, { headers: { "Content-Type": "application/json" } });
const deleteVariant = async (id) => await APIsCustomize.delete(`/variant/delete/${id}`, { headers: { "Content-Type": "application/json" } });
const UpdateVariantItem = async (formData) => await APIsCustomize.put(`/variant/update`, formData, { headers: { "Content-Type": "multipart/form-data" } });
export { createNewUser, handleListUser, handleUpdate, handleDeleteUser, handleCategories, handleListSubCate, addNewProduct, fetchListProduct, updateProduct, deleteProduct, AddNewVariant, GetListVariant, deleteVariant, UpdateVariantItem, fetchProductById };
