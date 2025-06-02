import { useEffect, useState } from "react";
import TableProduct from "./manageproduct/TableProduct";
import AddProduct from "./manageproduct/AddProduct";
import { fetchListProduct } from "../../services/GetAPI";
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
    return <div>Loading ....</div>;
  }
  if (error != null) {
    return <div>Can't handle User List duo to {error}</div>;
  }
  return (
    <>
      <div className="manage-product-container">
        <div className="manage-product-subcontainer head">
          <AddProduct handleProductsList={handleProductsList} />
        </div>
        <div className="manage-product-subcontainer body">
          <TableProduct InfoProduct={InfoProduct} handleProductsList={handleProductsList} />
        </div>
      </div>
    </>
  );
};
