import APIsCustomize from "../utils/APIsCustomize";

const NumberOfUsers = async () => await APIsCustomize.get("/user/count_user");
const NumberOfProducts = async () => await APIsCustomize.get("/product/count_product");
export { NumberOfUsers, NumberOfProducts };
