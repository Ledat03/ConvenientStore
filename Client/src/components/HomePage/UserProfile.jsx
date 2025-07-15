import { useState, useEffect } from "react";
import "../../assets/scss/userprofile.scss";
import { getUserProfile, updateInfo, handleChangePassword, cancelOrder } from "../../services/UserSevice";
import { re_Pay } from "../../services/AuthAPI";
import { fetchListOrderById } from "../../services/GetAPI";
import { useLocation } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import _ from "lodash";
import { toast } from "react-toastify";
import Logo from "../../assets/Winmart.svg";
const UserProfile = () => {
  const [controlModal, setActive] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [userInfo, setUserInfo] = useState({});
  const [Order, setOrder] = useState();
  const location = useLocation();
  const user = location.state.User;
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const updateProfile = async () => {
    try {
      await updateInfo(userInfo);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(user.id);
  const getListOrder = async () => {
    const res = await fetchListOrderById(user.id);
    console.log(res);
    setOrder(res.data.data);
  };

  const changePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return alert("Mật khẩu nhập lại không chính xác");
    } else {
      try {
        let changePassword = {
          id: userInfo.id,
          password: passwordData.newPassword,
          currentPassword: passwordData.currentPassword,
        };
        console.log(changePassword);
        await handleChangePassword(changePassword);
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    fetchUserInfo(user.id);
    getListOrder();
  }, []);
  const fetchUserInfo = async () => {
    const res = await getUserProfile(user.id);
    setUserInfo(res.data.data);
  };
  const handlePersonalInfoChange = (e) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePersonalInfoSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      alert("Thông tin cá nhân đã được cập nhật!");
      setLoading(false);
    }, 1000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }
    setLoading(true);

    setTimeout(() => {
      alert("Mật khẩu đã được thay đổi!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setLoading(false);
    }, 1000);
  };

  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };
  console.log(controlModal);
  const handleRetryPayment = async (orderId) => {
    setLoading(true);
    const res = await re_Pay(orderId);
    setTimeout(() => {
      alert(`Đang chuyển hướng đến trang thanh toán cho đơn hàng #${orderId}`);
      window.location.href = res.data;
      setLoading(false);
    }, 1000);
  };

  const closeOrderDetails = () => {
    setShowOrderDetails(false);
    setSelectedOrder(null);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      DELIVERED: { text: "Đã giao", class: "status-delivered" },
      SHIPPING: { text: "Đang giao", class: "status-shipping" },
      PENDING: { text: "Chờ xử lý", class: "status-pending" },
      CANCELLED: { text: "Đã hủy", class: "status-cancelled" },
      COMPLETED: { text: "Hoàn thành", class: "status-completed" },
      FAILED: { text: "Thất bại", class: "status-failed" },
    };
    const statusInfo = statusMap[status] || { text: status, class: "status-default" };
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };
  const confirmCancel = async (id) => {
    const res = await cancelOrder(id);
    toast.success("Hủy đơn hàng thành công !");
    getListOrder();
    setActive(false);
  };
  return (
    <div className="user-profile-container">
      <div className="profile-sidebar">
        <div className="sidebar-header">
          <a href="/">
            <img src={Logo} alt="" />
          </a>
          <p>Xin chào, {userInfo.username}!</p>
        </div>
        <nav className="sidebar-nav">
          <button className={`nav-item ${activeTab === "personal" ? "active" : ""}`} onClick={() => setActiveTab("personal")}>
            <i className="icon-user"></i>
            <span>Thông tin cá nhân</span>
          </button>
          <button className={`nav-item ${activeTab === "password" ? "active" : ""}`} onClick={() => setActiveTab("password")}>
            <i className="icon-lock"></i>
            <span>Thay đổi mật khẩu</span>
          </button>
          <button className={`nav-item ${activeTab === "orders" ? "active" : ""}`} onClick={() => setActiveTab("orders")}>
            <i className="icon-shopping"></i>
            <span>Quản lý đơn hàng</span>
          </button>
        </nav>
      </div>
      <div className="profile-main">
        <div className="profile-header">
          <h1>
            {activeTab === "personal" && "Thông tin cá nhân"}
            {activeTab === "password" && "Thay đổi mật khẩu"}
            {activeTab === "orders" && "Quản lý đơn hàng"}
          </h1>
          <p>
            {activeTab === "personal" && "Cập nhật thông tin cá nhân của bạn"}
            {activeTab === "password" && "Đảm bảo tài khoản của bạn được bảo mật"}
            {activeTab === "orders" && "Theo dõi trạng thái đơn hàng của bạn"}
          </p>
        </div>

        <div className="profile-content">
          {activeTab === "personal" && (
            <div className="tab-content">
              <form onSubmit={handlePersonalInfoSubmit} className="personal-info-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="username">Tên đăng nhập</label>
                    <input type="text" id="username" name="username" value={userInfo.username || ""} onChange={handlePersonalInfoChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" value={userInfo.email || ""} disabled />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">Họ</label>
                    <input type="text" id="firstName" name="firstName" value={userInfo.firstName || ""} onChange={handlePersonalInfoChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Tên</label>
                    <input type="text" id="lastName" name="lastName" value={userInfo.lastName || ""} onChange={handlePersonalInfoChange} required />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Số điện thoại</label>
                  <input type="tel" id="phone" name="phone" value={userInfo.phone || ""} onChange={handlePersonalInfoChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="address">Địa chỉ</label>
                  <textarea id="address" name="address" value={userInfo.address || ""} onChange={handlePersonalInfoChange} rows="3" required />
                </div>
                <button type="submit" className="submit-btn" disabled={loading} onClick={updateProfile}>
                  {loading ? "Đang cập nhật..." : "Cập nhật thông tin"}
                </button>
              </form>
            </div>
          )}

          {activeTab === "password" && (
            <div className="tab-content">
              <form onSubmit={handlePasswordSubmit} className="password-form">
                <div className="form-group">
                  <label htmlFor="currentPassword">Mật khẩu hiện tại</label>
                  <input type="password" id="currentPassword" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="newPassword">Mật khẩu mới</label>
                  <input type="password" id="newPassword" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required minLength="6" />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
                  <input type="password" id="confirmPassword" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} required minLength="6" />
                </div>
                <button type="submit" className="submit-btn" disabled={loading} onClick={changePassword}>
                  {loading ? "Đang thay đổi..." : "Thay đổi mật khẩu"}
                </button>
              </form>
            </div>
          )}
          <>
            {" "}
            <Modal size="md" show={controlModal} onHide={() => setActive(false)}>
              <Modal.Header closeButton>Hủy Đặt Hàng</Modal.Header>
              <Modal.Body>
                <span>Bạn có chắc chắn muốn hủy đơn hàng này không ?</span>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={() => setActive(false)}>Hủy</Button>
                <Button
                  className="btn-danger"
                  onClick={() => {
                    confirmCancel(selectedOrder.orderId);
                  }}
                >
                  Xác Nhận
                </Button>
              </Modal.Footer>
            </Modal>
          </>
          {activeTab === "orders" && (
            <div className="tab-content">
              <div className="orders-list">
                {Order.length === 0 ? (
                  <div className="empty-orders">
                    <p>Bạn chưa có đơn hàng nào</p>
                  </div>
                ) : (
                  Order.map((order) => (
                    <div key={order.orderId} className="order-card">
                      <div className="order-header">
                        <div className="order-info">
                          <h3>Đơn hàng {order.orderId}</h3>
                          <p className="order-total">{formatCurrency(order.totalPrice)}</p>
                        </div>
                        {order.delivery.deliveryStatus === "FAILED" && order.payment.paymentStatus === "SUCCESS" && (
                          <div className="warning-notice">
                            <span>
                              Bạn hãy liên hệ với số điện thoại chăm sóc khách hàng hoặc chatbot <br /> để được hướng dẫn hoàn lại tiền đã thanh toán
                            </span>
                          </div>
                        )}
                        <div className="order-actions">
                          <button className="detail-btn" onClick={() => handleViewOrderDetails(order)}>
                            Xem chi tiết
                          </button>
                          {order.payment.paymentStatus === "FAILED" && (
                            <button className="retry-payment-btn" onClick={() => handleRetryPayment(order.orderId)} disabled={loading}>
                              Thanh toán lại
                            </button>
                          )}
                          {order.delivery.deliveryStatus === "PENDING" && (
                            <button
                              className="retry-payment-btn"
                              onClick={() => {
                                setSelectedOrder(order);
                                setActive(true);
                              }}
                              disabled={loading}
                            >
                              Hủy Đơn Hàng
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="order-summary">
                        <div className="delivery-summary">
                          <h4>Thông tin giao hàng</h4>
                          <div className="summary-item">
                            <span>Trạng thái:</span>
                            {getStatusBadge(order.delivery.deliveryStatus)}
                          </div>
                          <div className="summary-item">
                            <span>Người nhận:</span>
                            <span>{order.delivery.receiverName}</span>
                          </div>
                          <div className="summary-item">
                            <span>Địa chỉ:</span>
                            <span>{order.delivery.deliveryAddress}</span>
                          </div>
                          <div className="summary-item">
                            <span>Mã vận chuyển:</span>
                            <span>{order.delivery.trackingNumber || "Đang cập nhật"}</span>
                          </div>
                        </div>

                        <div className="payment-summary">
                          <h4>Thông tin thanh toán</h4>
                          <div className="summary-item">
                            <span>Trạng thái:</span>
                            {getStatusBadge(order.payment.paymentStatus)}
                          </div>
                          <div className="summary-item">
                            <span>Phương thức:</span>
                            <span>{order.payment.paymentMethod === "CREDIT_CARD" ? "Thẻ tín dụng" : "Thanh toán khi nhận hàng"}</span>
                          </div>
                          <div className="summary-item">
                            <span>Số tiền:</span>
                            <span>{formatCurrency(order.payment.paymentAmount)}</span>
                          </div>
                          <div className="summary-item">
                            <span>Ngày thanh toán:</span>
                            <span>{order.payment.paymentDate ? formatDate(order.payment.paymentDate) : "Chưa thanh toán"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {showOrderDetails && selectedOrder && (
        <div className="modal-overlay" onClick={closeOrderDetails}>
          <div className="modal-content-profile" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chi tiết đơn hàng {selectedOrder.orderId}</h3>
              <button className="close-btn" onClick={closeOrderDetails}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="order-products">
                <h4>Sản phẩm đã mua</h4>
                <div className="products-list">
                  {selectedOrder.orderItemDTOs.map((item) => (
                    <div key={item.orderId} className="product-item">
                      <img src={item.product.image || "/placeholder.svg"} alt={item.product.productName} className="product-image" />
                      <div className="product-info">
                        <h5>{item.product.productName}</h5>
                        <div className="product-details">
                          <span>Số lượng: {item.quantity}</span>
                          <span className="product-price">{formatCurrency(item.totalPrice)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="order-total-detail">
                  <strong>Tổng cộng: {formatCurrency(selectedOrder.totalPrice)}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
