import APIsCustomize from "../utils/APIsCustomize";
const AddToCart = async (info) => await APIsCustomize.post("cart/add", info, { headers: { "Content-Type": "application/json" } });
const ViewCart = async (userId) => await APIsCustomize.get("cart/view", { params: { userId }, headers: { "Content-Type": "application/json" } });
const DeleteCartDetail = async (cartDetailId) => APIsCustomize.delete("cart/delete", { params: { cartDetailId }, headers: { "Content-Type": "application/json" } });
const getMainPage = async () => APIsCustomize.get("/", { headers: { "Content-Type": "application/json" } });
export { AddToCart, ViewCart, DeleteCartDetail, getMainPage };
