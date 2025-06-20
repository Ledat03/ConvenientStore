import { useEffect, useState } from "react";
import TablePromotion from "./managepromotion/TablePromotion";
import { fetchListPromotion } from "../../services/GetAPI";
import LoadingAnimation from "../common/LoadingAnimation";
const ManagePromotion = () => {
  const [InfoPromotion, setInfoPromotion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    handlePromotionList();
  }, []);
  const handlePromotionList = async () => {
    let response = await fetchListPromotion();
    setInfoPromotion(response.data.data);
    setLoading(false);
  };
  if (loading) {
    return <LoadingAnimation />;
  }
  if (error != null) {
    return <div>Không thể hiển thị mã giảm giá do {error}</div>;
  }
  return (
    <>
      <div className="manage-product-container">
        <div className="manage-product-subcontainer body">
          <TablePromotion InfoPromotion={InfoPromotion} handlePromotionList={handlePromotionList} />
        </div>
      </div>
    </>
  );
};
export default ManagePromotion;
