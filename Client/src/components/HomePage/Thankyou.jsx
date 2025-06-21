import { useSearchParams, Link } from "react-router-dom";
import "../../assets/scss/home.scss";
import logo from "../../assets/order.png";
const Thankyou = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  return (
    <>
      <div className="Thank-Component">
        <div className="COD">
          <img src={logo} alt="" />
          <div className="COD-text">
            <h3>Cảm ơn bạn đã đặt hàng</h3>
            {status && <h3>Thanh toán thành công</h3>}
            <h5>Đơn hàng của bạn đang được xác nhận và bàn giao cho đơn vị vận chuyển</h5>
            <div className="button">
              <Link to={"/"}>Quay về trang chủ</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Thankyou;
