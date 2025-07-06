import { useState, useEffect } from "react";
import "../../assets/scss/userprofile.scss";
import { getUserProfile, updateInfo, handleChangePassword } from "../../services/UserSevice";
import { fetchListOrderById } from "../../services/GetAPI";
import { useLocation } from "react-router-dom";
import _ from "lodash";
const UserProfile = () => {
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
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
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
    setOrders([
      {
        id: 1,
        total: 250000,
        orderDetails: [
          {
            id: 1,
            quantity: 2,
            totalPrice: 100000,
            product: { name: "Coca Cola 330ml", image: "/placeholder.svg?height=60&width=60" },
          },
          {
            id: 2,
            quantity: 1,
            totalPrice: 150000,
            product: { name: "Bánh mì thịt nướng", image: "/placeholder.svg?height=60&width=60" },
          },
        ],
        payment: {
          paymentMethod: "CREDIT_CARD",
          amount: 250000,
          paymentStatus: "COMPLETED",
          paymentDate: "2024-01-15",
          transactionId: "TXN123456789",
        },
        delivery: {
          delivery_status: "DELIVERED",
          delivery_address: "123 Main Street, Ho Chi Minh City",
          receiver_name: "John Doe",
          receiver_phone: "+84 123 456 789",
          tracking_number: "TN123456789",
          delivered_at: "2024-01-18",
          delivery_method: "Giao hàng tiêu chuẩn",
        },
      },
      {
        id: 2,
        total: 180000,
        orderDetails: [
          {
            id: 3,
            quantity: 3,
            totalPrice: 180000,
            product: { name: "Nước suối Aquafina 500ml", image: "/placeholder.svg?height=60&width=60" },
          },
        ],
        payment: {
          paymentMethod: "CREDIT_CARD",
          amount: 180000,
          paymentStatus: "FAILED",
          paymentDate: "2024-01-20",
          transactionId: "TXN987654321",
        },
        delivery: {
          delivery_status: "PENDING",
          delivery_address: "456 Second Street, Ho Chi Minh City",
          receiver_name: "John Doe",
          receiver_phone: "+84 123 456 789",
          tracking_number: "TN987654321",
          delivered_at: null,
          delivery_method: "Giao hàng nhanh",
        },
      },
      {
        id: 3,
        total: 320000,
        orderDetails: [
          {
            id: 4,
            quantity: 1,
            totalPrice: 120000,
            product: { name: "Cơm gà Hải Nam", image: "/placeholder.svg?height=60&width=60" },
          },
          {
            id: 5,
            quantity: 2,
            totalPrice: 200000,
            product: { name: "Trà sữa trân châu", image: "/placeholder.svg?height=60&width=60" },
          },
        ],
        payment: {
          paymentMethod: "CASH_ON_DELIVERY",
          amount: 320000,
          paymentStatus: "PENDING",
          paymentDate: "2024-01-22",
          transactionId: null,
        },
        delivery: {
          delivery_status: "SHIPPING",
          delivery_address: "789 Third Avenue, Ho Chi Minh City",
          receiver_name: "John Doe",
          receiver_phone: "+84 123 456 789",
          tracking_number: "TN456789123",
          delivered_at: null,
          delivery_method: "Giao hàng tiêu chuẩn",
        },
      },
    ]);
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

  const handleRetryPayment = (orderId) => {
    setLoading(true);

    setTimeout(() => {
      alert(`Đang chuyển hướng đến trang thanh toán cho đơn hàng #${orderId}`);
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

  return (
    <div className="user-profile-container">
      <div className="profile-sidebar">
        <div className="sidebar-header">
          <h2>TÀI KHOẢN</h2>
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
                    <input type="text" id="username" name="username" value={userInfo.username} onChange={handlePersonalInfoChange} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" value={userInfo.email} disabled />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">Họ</label>
                    <input type="text" id="firstName" name="firstName" value={userInfo.firstName} onChange={handlePersonalInfoChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Tên</label>
                    <input type="text" id="lastName" name="lastName" value={userInfo.lastName} onChange={handlePersonalInfoChange} required />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Số điện thoại</label>
                  <input type="tel" id="phone" name="phone" value={userInfo.phone} onChange={handlePersonalInfoChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="address">Địa chỉ</label>
                  <textarea id="address" name="address" value={userInfo.address} onChange={handlePersonalInfoChange} rows="3" required />
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

          {activeTab === "orders" && (
            <div className="tab-content">
              <div className="orders-list">
                {orders.length === 0 ? (
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
                        <div className="order-actions">
                          <button className="detail-btn" onClick={() => handleViewOrderDetails(order)}>
                            Xem chi tiết
                          </button>
                          {order.payment.paymentStatus === "FAILED" && order.payment.paymentMethod !== "CASH_ON_DELIVERY" && (
                            <button className="retry-payment-btn" onClick={() => handleRetryPayment(order.id)} disabled={loading}>
                              Thanh toán lại
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="order-summary">
                        <div className="delivery-summary">
                          <h4>🚚 Thông tin giao hàng</h4>
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
                          <h4>💳 Thông tin thanh toán</h4>
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
