import { useEffect, useState } from "react";
import TableProduct from "./manageproduct/TableProduct";
import { NumberOfProducts } from "../../services/ManageAPI";
import { fetchListProduct } from "../../services/GetAPI";
import LoadingAnimation from "../common/LoadingAnimation";
export const ManageProduct = () => {
  const [InfoProduct, setInfoProduct] = useState({ data: [], totalItems: 0 });
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({ status: null, state: null, name: null, page: 0 });
  useEffect(() => {
    handleProductsList(filter);
    numberOfProducts();
  }, [filter]);
  console.log(filter)
  const numberOfProducts = async () => {
    let num = await NumberOfProducts();
    setCount(num.data);
  }
  const handleProductsList = async (filter) => {
    try {
      let resProduct = await fetchListProduct(filter);
      console.log(resProduct, "product data")
      setInfoProduct({ totalItems: resProduct.data.totalItems, data: resProduct.data.data });
      setLoading(false);
    } catch (error) {
      setError(error);
    }

  };
  if (loading) {
    return <LoadingAnimation />;
  }
  if (error != null) {
    return <div>Something went wrong</div>;
  }
  console.log(InfoProduct.data)
  return (
    <>
      <div className="manage-product-container">
        <div className="manage-product-subcontainer body">
          <TableProduct InfoProduct={InfoProduct} setInfoProduct={setInfoProduct} filter={filter} setFilter={setFilter} handleProductsList={handleProductsList} />
        </div>
      </div>
    </>
  );
};
