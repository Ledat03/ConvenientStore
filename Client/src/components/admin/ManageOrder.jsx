import { useState, useEffect } from "react";
import "../../assets/scss/manageorder.scss";
import { fetchListOrder } from "../../services/GetAPI";
import { ButtonGroup, Dropdown } from "react-bootstrap";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import OrderDetail from "./manageorder/OrderDetail";
import UpdatePayment from "./manageorder/UpdatePayment";
import UpdateDelivery from "./manageorder/UpdateDelivery";
import DeleteOrder from "./manageorder/DeleteOrder";
import Paginate from "../common/Paginate";
const ManageOrder = () => {
  const [ListOrder, setListOrder] = useState([]);
  const [isActive, setActive] = useState({
    Detail: false,
    UpdateDelivery: false,
    UpdatePayment: false,
    Delete: false,
  });
  const itemsPerPage = 3;
  const totalItem = ListOrder.length;
  const [PaginatedItem, setPaginatedItem] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState();
  useEffect(() => {
    getListOrder();
  }, []);

  const getListOrder = async () => {
    const res = await fetchListOrder();
    setListOrder(res.data.data);
    console.log("Updated");
  };
  const setStatus = (status) => {
    switch (status) {
      case "PENDING":
        return "Chưa giao hàng";
      case "SHIPPED":
        return "Đang giao hàng";
      case "DELIVERED":
        return "Đã giao hàng";
      case "FAILED":
        return "Đã hủy";
      case "RETURNED":
        return "Đã hoàn tiền";
      case "CANCELLED":
        return "Đã hoàn hàng";
    }
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
  const [filters, setFilters] = useState({
    time: "Default",
    payment_Status: "Default",
    delivery_Status: "Default",
    search: "",
  });
  const filledProduct = () => {
    const now = new Date();
    return ListOrder.filter((item) => {
      if (filters.time !== "Default") {
        const importDate = new Date(item.delivery.deliveryDate);
        const diffInDays = (now - importDate) / (1000 * 60 * 60 * 24);
        return diffInDays <= parseInt(filters.time);
      }
      return true;
    })
      .filter((item) => (filters.payment_Status !== "Default" ? item.payment.paymentStatus === filters.payment_Status : item))
      .filter((item) => (filters.delivery_Status !== "Default" ? item.delivery.deliveryStatus === filters.delivery_Status : item))
      .filter((item) => item.delivery.receiverName.toLowerCase().includes(filters.search));
  };
  const filterList = filledProduct();
  return (
    <div className="manage-order">
      <div className="header">
        <div className="breadcrumb">
          <span className="breadcrumb-item">Trang chủ</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-item active">Quản lí đơn hàng</span>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">Export</button>
        </div>
      </div>
      <h1 className="page-title">Quản lí đơn hàng</h1>
      <div className="controls">
        <div className="controls-left">
          <div className="search-container">
            <input type="text" placeholder="Search order" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} className="search-input" />
            <span className="search-icon">🔍</span>
          </div>
        </div>
        <div className="controls-right">
          <select value={filters.time} onChange={(e) => setFilters({ ...filters, time: e.target.value })} className="time-filter">
            <option value="Default">Theo thời gian</option>
            <option value={30}>Last 30 days</option>
            <option value={7}>Last 7 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <select value={filters.delivery_Status} onChange={(e) => setFilters({ ...filters, delivery_Status: e.target.value })} className="time-filter">
            <option value="Default">Trang thái giao hàng</option>
            <option value="PENDING">Đang chờ giao hàng</option>
            <option value="SHIPPED">Đang giao hàng</option>
            <option value="DELIVERED">Đã giao hàng</option>
            <option value="RETURNED">Hoàn hàng</option>
            <option value="FAILED">Lỗi giao hàng</option>
            <option value="CANCELLED">Hàng đã được hoàn lại</option>
          </select>
          <select value={filters.payment_Status} onChange={(e) => setFilters({ ...filters, payment_Status: e.target.value })} className="time-filter">
            <option value="Default">Trang thái thanh toán</option>
            <option value="PENDING">Đang chờ thanh toán</option>
            <option value="SUCCESS">Thanh Toán Thành Công</option>
            <option value="RETURNED">Hoàn Tiền</option>
            <option value="FAILED">Lỗi Giao Dịch</option>
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
              <th>Đơn hàng</th>
              <th>Ngày giao hàng hàng</th>
              <th>Tên người dùng</th>
              <th>Trạng thái thanh toán</th>
              <th>Trạng thái giao hàng</th>
              <th>Phương thức thanh toán</th>
              <th>Tổng tiền</th>
            </tr>
          </thead>
          <tbody>
            {PaginatedItem.map((order, index) => (
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
                <td className="order-date">{order.delivery.deliveryDate ? new Date(order.delivery.deliveryDate).toLocaleDateString("vi-VN") : "Chưa giao hàng"}</td>
                <td className="customer">
                  <div className="customer-info">
                    <span className="customer-name">{order.user.username}</span>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${getStatusClass(order.paymentStatus, "payment")}`}>{order.payment.paymentStatus}</span>
                </td>
                <td>
                  <span className={`status-badge ${getStatusClass(order.fulfillmentStatus, "fulfillment")}`}>{setStatus(order.delivery.deliveryStatus)}</span>
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

                      <Dropdown.Item
                        onClick={() => {
                          setSelectedOrder(order);
                          setActive({ ...isActive, Delete: true });
                        }}
                      >
                        Xóa
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination-container">
          <Paginate itemsPerPage={itemsPerPage} totalItem={totalItem} item={filterList} setPaginatedItem={setPaginatedItem} sortBy={filters} />
        </div>
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
          getListOrder={getListOrder}
        />
        <UpdatePayment
          close={() => {
            setActive({ ...isActive, UpdatePayment: false });
          }}
          isActive={isActive}
          Order={selectedOrder}
          getListOrder={getListOrder}
        />
        <DeleteOrder
          Order={selectedOrder}
          reload={getListOrder}
          close={() => {
            setActive({ ...isActive, Delete: false });
          }}
          isActive={isActive.Delete}
        />
      </>
    </div>
  );
};

export default ManageOrder;
