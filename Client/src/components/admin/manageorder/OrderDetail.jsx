import "../../../assets/scss/manageorder.scss";
import { Modal, Button } from "react-bootstrap";
import logo from "../../../assets/Winmart.svg";
const OrderDetail = (props) => {
  const summary = {
    subtotal: 1632.4,
    shippingCost: 10000,
    total: 1636.89,
  };
  const handlePrint = () => {
    document.body.classList.add("printing");
    setTimeout(() => {
      window.print();
      document.body.classList.remove("printing");
    }, 100);
  };
  return (
    <Modal show={props.isActive.Detail} onHide={props.close} size="xl">
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <div className="order-detail">
          <div className="order-detail_header">
            <div className="logo">
              <img src={logo} alt="" />
            </div>
            <div className="document-type">Hóa đơn hàng hóa</div>
          </div>
          <div className="order-details">
            <h2 className="section-title">Thông tin đơn hàng</h2>

            <div className="details-grid">
              <div className="details-column">
                <div className="detail-row">
                  <span className="label">Mã Đơn Hàng</span>
                  <span className="colon">:</span>
                  <span className="value">{props.Order?.orderId}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Địa Chỉ</span>
                  <span className="colon">:</span>
                  <span className="value">{props.Order?.user.address}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Ngày Đặt Hàng</span>
                  <span className="colon">:</span>
                  <span className="value">{new Date(props.Order?.payment.createTime).toLocaleDateString("vi-VN")}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Người Đặt Hàng</span>
                  <span className="colon">:</span>
                  <span className="value">{props.Order?.user.username}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Email</span>
                  <span className="colon">:</span>
                  <span className="value">{props.Order?.user.email}</span>
                </div>
              </div>

              <div className="details-column">
                <div className="detail-row">
                  <span className="label">Mã Hóa Đơn</span>
                  <span className="colon">:</span>
                  <span className="value">{props.Order?.delivery.deliveryId}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Số Điện Thoại</span>
                  <span className="colon">:</span>
                  <span className="value">{props.Order?.delivery.receiverPhone}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Trạng Thái</span>
                  <span className="colon">:</span>
                  <span className="value">
                    <span className="status-badge status-paid">{props.Order?.payment.paymentStatus}</span>
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Người Nhận</span>
                  <span className="colon">:</span>
                  <span className="value">{props.Order?.delivery.receiverName}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Địa Chỉ Nhận</span>
                  <span className="colon">:</span>
                  <span className="value">{props.Order?.delivery.deliveryAddress}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="order-items">
            <h2 className="section-title">Danh Sách Sản Phẩm</h2>

            <div className="items-table-container">
              <table className="items-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên Sản Phẩm</th>
                    <th>SKU</th>
                    <th>Đơn Vị Tính</th>
                    <th>Số Lượng</th>
                    <th>Thuế VAT</th>
                    <th>Tổng Tiền</th>
                  </tr>
                </thead>
                {console.log(props.Order)}
                <tbody>
                  {props.Order?.orderItemDTOs.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td className="product-name">{item.product.productName}</td>
                      <td className="sku">{item.product.sku}</td>
                      <td className="seller-sku">{item.productVariant.calUnit}</td>
                      <td className="sku">{item.quantity}</td>
                      <td className="vat">10%</td>
                      <td className="total-price">{item.totalPrice.toLocaleString("vn-VN", { style: "currency", currency: "VND" })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="order-summary">
              <div className="summary-row">
                <span className="summary-label">Phí Giao Hàng</span>
                <span className="summary-value">{summary.shippingCost.toLocaleString("vn-VN", { style: "currency", currency: "VND" })}</span>
              </div>
              <div className="summary-row total-row">
                <span className="summary-label">Tổng Tiền</span>
                <span className="summary-value">{(summary.shippingCost + props.Order?.totalPrice).toLocaleString("vn-VN", { style: "currency", currency: "VND" })}</span>
              </div>
            </div>
          </div>
          <div className="footer">
            <p className="contact-info">
              Nếu bạn có bất kì thắc mắc gì về hóa đơn xin liên hệ với nhân viên chăm sóc khách hàng với số điện thoại <strong>+0188 200 300</strong> hoặc gửi Email tới địa chỉ <strong>WinmartService@gmail.com</strong>
            </p>
            <p className="thank-you">Cảm ơn bạn đã mua hàng</p>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handlePrint}>Xuất hóa đơn</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderDetail;
