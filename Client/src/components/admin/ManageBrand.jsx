import { viewBrand } from "../../services/GetAPI";
import { useEffect, useState } from "react";
import LoadingAnimation from "../common/LoadingAnimation";
import AddBrand from "./managebrand/AddBrand";
import { TableBrand } from "./managebrand/TableBrand";
export const ManageBrand = () => {
  const [Brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    handleBrands();
  }, []);
  const handleBrands = async () => {
    try {
      const listBrand = await viewBrand();
      setBrands(listBrand.data);
      setLoading(false);
      setError(null);
    } catch (e) {
      setLoading(false);
      setError(e);
      throw e;
    }
  };
  if (loading) {
    return <LoadingAnimation />;
  }
  if (error != null) {
    return <div>Không thể lấy dữ liệu do {error}</div>;
  }
  return (
    <div className="manage-user-container">
      <div className="manage-user-subcontainer">
        <>
          <AddBrand handleBrands={handleBrands} />
        </>
      </div>
      <div className="table-user">
        <TableBrand handleBrands={handleBrands} Brands={Brands} />
      </div>
    </div>
  );
};
