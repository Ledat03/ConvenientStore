import { useState, useEffect } from "react";
import "../../assets/scss/manageorder.scss";
import { fetchListOrder } from "../../services/GetAPI";
import { ButtonGroup, Dropdown } from "react-bootstrap";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import OrderDetail from "./manageorder/OrderDetail";
import UpdatePayment from "./manageorder/UpdatePayment";
import UpdateDelivery from "./manageorder/UpdateDelivery";
const ManageOrder = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("Last 30 days");
  const [ListOrder, setListOrder] = useState([]);
  const [isActive, setActive] = useState({
    Detail: false,
    UpdateDelivery: false,
    UpdatePayment: false,
  });
  const [selectedOrder, setSelectedOrder] = useState();
  useEffect(() => {
    getListOrder();
  }, []);
  const getListOrder = async () => {
    const res = await fetchListOrder();
    setListOrder(res.data.data);
  };
  const getStatusClass = (status, type) => {
    const statusMap = {
      payment: {
        Refunded: "status-refunded",
        Due: "status-due",
        Cancelled: "status-cancelled",
        Paid: "status-paid",
      },
      fulfillment: {
        Unfulfilled: "status-unfulfilled",
        "Partially Fulfilled": "status-partially-fulfilled",
      },
      shipping: {
        Standard: "shipping-standard",
        Economy: "shipping-economy",
        Express: "shipping-express",
      },
    };
    return statusMap[type][status] || "";
  };

  return (
    <div className="manage-order">
      <div className="header">
        <div className="breadcrumb">
          <span className="breadcrumb-item">Home</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-item active">Order list</span>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">Export</button>
          <button className="btn-secondary">Import</button>
        </div>
      </div>
      <h1 className="page-title">Order list</h1>
      <div className="controls">
        <div className="controls-left">
          <div className="search-container">
            <input type="text" placeholder="Search order" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
            <span className="search-icon">🔍</span>
          </div>
        </div>
        <div className="controls-right">
          <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} className="time-filter">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
      </div>
      <div className="table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>
                <input type="checkbox" />
              </th>
              <th>Order</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Payment status</th>
              <th>Fulfillment status</th>
              <th>Shipping method</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {ListOrder.map((order, index) => (
              <tr
                key={index}
                onClick={() => {
                  setSelectedOrder(order);
                  setActive({ ...isActive, Detail: true });
                }}
              >
                <td>
                  <input type="checkbox" />
                </td>
                <td className="order-id">{order.orderId}</td>
                <td className="order-date">{order.delivery.deliveryDate ? new Date(order.delivery.deliveryDate).toISOString().slice(0, 16) : ""}</td>
                <td className="customer">
                  <div className="customer-info">
                    <span className="customer-name">{order.user.username}</span>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${getStatusClass(order.paymentStatus, "payment")}`}>{order.payment.paymentStatus}</span>
                </td>
                <td>
                  <span className={`status-badge ${getStatusClass(order.fulfillmentStatus, "fulfillment")}`}>{order.delivery.deliveryMethod == "ship" ? "Giao hàng" : "Nhận tại cửa hàng"}</span>
                </td>
                <td>
                  <span className={`status-badge ${getStatusClass(order.shippingMethod, "shipping")}`}>{order.payment.paymentMethod == "COD" ? "COD" : "VNPay"}</span>
                </td>
                <td className="order-total">{order.totalPrice.toLocaleString("vn-VN", { style: "currency", currency: "VND" })}</td>
                <td>
                  <Dropdown
                    className="btn-menu custom-dropdown"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Dropdown.Toggle as={ButtonGroup} split>
                      <HiOutlineDotsHorizontal />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <div className="dropdown-submenu">
                        <Dropdown.Item className="submenu-toggle">Sửa Thông Tin</Dropdown.Item>
                        <div className="submenu">
                          <div
                            className="dropdown-item"
                            onClick={() => {
                              setSelectedOrder(order);
                              setActive({ ...isActive, UpdateDelivery: true });
                            }}
                          >
                            Thông Tin Giao Hàng
                          </div>
                          <div
                            className="dropdown-item"
                            onClick={() => {
                              setSelectedOrder(order);
                              setActive({ ...isActive, UpdatePayment: true });
                            }}
                          >
                            Thông Tin Thanh Toán
                          </div>
                        </div>
                      </div>

                      <Dropdown.Item>Xóa</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <>
        <OrderDetail
          close={() => {
            setActive({ ...isActive, Detail: false });
          }}
          isActive={isActive}
          Order={selectedOrder}
        />
        <UpdateDelivery
          close={() => {
            setActive({ ...isActive, UpdateDelivery: false });
          }}
          isActive={isActive}
          Order={selectedOrder}
        />
        <UpdatePayment
          close={() => {
            setActive({ ...isActive, UpdatePayment: false });
          }}
          isActive={isActive}
          Order={selectedOrder}
        />
      </>
    </div>
  );
};

export default ManageOrder;
