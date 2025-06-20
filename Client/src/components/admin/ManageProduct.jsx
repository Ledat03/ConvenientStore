import { useEffect, useState } from "react";
import TableProduct from "./manageproduct/TableProduct";
import { fetchListProduct } from "../../services/GetAPI";
import LoadingAnimation from "../common/LoadingAnimation";
export const ManageProduct = () => {
  const [InfoProduct, setInfoProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    handleProductsList();
  }, []);
  const handleProductsList = async () => {
    let response = await fetchListProduct();
    setInfoProduct(response.data.data);
    setLoading(false);
  };
  if (loading) {
    return <LoadingAnimation />;
  }
  if (error != null) {
    return <div>Không thể lấy danh sách sản phẩm {error}</div>;
  }
  return (
    <>
      <div className="manage-product-container">
        <div className="manage-product-subcontainer body">
          <TableProduct InfoProduct={InfoProduct} handleProductsList={handleProductsList} />
        </div>
      </div>
    </>
  );
};
