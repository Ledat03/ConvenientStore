import { useState, useEffect } from "react";
import "../../assets/scss/manageorder.scss";
import { deleteOrder, fetchListOrder } from "../../services/GetAPI";
import { ButtonGroup, Dropdown } from "react-bootstrap";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import OrderDetail from "./manageorder/OrderDetail";
import UpdatePayment from "./manageorder/UpdatePayment";
import UpdateDelivery from "./manageorder/UpdateDelivery";
import DeleteOrder from "./manageorder/DeleteOrder";
import Pageable from "../common/Pageable";
import AdminDataTable from "./common/AdminDataTable";
import { toast } from "react-toastify";
const ManageOrder = () => {
  const [ListOrder, setListOrder] = useState({ Orders: [], totalItems: 0 });
  const [isActive, setActive] = useState({
    Detail: false,
    UpdateDelivery: false,
    UpdatePayment: false,
    Delete: false,
  });
  const [filters, setFilters] = useState({
    time: "0",
    paymentStatus: null,
    deliveryStatus: null,
    search: null,
    page: 0
  });
  const [tempFilters, setTempFilters] = useState({
    time: "0",
    paymentStatus: null,
    deliveryStatus: null,
    search: null,
    page: 0
  });
  const [selectedOrder, setSelectedOrder] = useState();

  useEffect(() => {
    getListOrder(filters);
  }, [filters]);

  const getListOrder = async (filters) => {
    const res = await fetchListOrder(filters);
    setListOrder({ Orders: res.data.data, totalItems: res.data.totalItems });
  };
  console.log(ListOrder)
  const setStatus = (status) => {
    switch (status) {
      case "PENDING":
        return "Pending";
      case "SHIPPED":
        return "Shipping";
      case "DELIVERED":
        return "Delivered";
      case "FAILED":
        return "Failed";
      case "RETURNED":
        return "Returned";
      case "CANCELLED":
        return "Cancelled";
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

  const orderColumns = [
    {
      key: "orderId",
      title: "Order",
      render: (order) => <span className="order-id">{order.orderId}</span>,
    },
    {
      key: "deliveryDate",
      title: "Delivery Date",
      render: (order) => <span className="order-date">{order.delivery.deliveryDate ? new Date(order.delivery.deliveryDate).toLocaleDateString("vi-VN") : "Pending"}</span>,
    },
    {
      key: "user",
      title: "User Email",
      render: (order) => (
        <div className="customer-info">
          <span className="customer-name">{order.user.username}</span>
        </div>
      ),
    },
    {
      key: "paymentStatus",
      title: "Payment State",
      render: (order) => <span className={`status-badge ${getStatusClass(order.paymentStatus, "payment")}`}>{order.payment.paymentStatus}</span>,
    },
    {
      key: "deliveryState",
      title: "Delivery State",
      render: (order) => <span className={`status-badge ${getStatusClass(order.fulfillmentStatus, "fulfillment")}`}>{setStatus(order.delivery.deliveryStatus)}</span>,
    },
    {
      key: "paymentMethod",
      title: "Payment Method",
      render: (order) => <span className={`status-badge ${getStatusClass(order.shippingMethod, "shipping")}`}>{order.payment.paymentMethod == "COD" ? "COD" : "VNPay"}</span>,
    },
    {
      key: "totalPrice",
      title: "Total",
      render: (order) => <span className="order-pay">{order.totalPrice.toLocaleString("vn-VN", { style: "currency", currency: "VND" })}</span>,
    },
  ];

  const renderOrderActions = (order) => (
    <Dropdown
      className="btn-menu custom-dropdown"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Dropdown.Toggle as={ButtonGroup} split>
        <HiOutlineDotsHorizontal />
      </Dropdown.Toggle>
      <Dropdown.Menu
        renderOnMount
        popperConfig={{ strategy: "fixed" }}
      >
        <div className="dropdown-submenu">
          <Dropdown.Item className="submenu-toggle">Change</Dropdown.Item>
          <div className="submenu">
            <div
              className="dropdown-item"
              onClick={() => {
                setSelectedOrder(order);
                setActive({ ...isActive, UpdateDelivery: true });
              }}
            >
              Information
            </div>
            <div
              className="dropdown-item"
              onClick={() => {
                setSelectedOrder(order);
                setActive({ ...isActive, UpdatePayment: true });
              }}
            >
              Payment Information
            </div>
          </div>
        </div>

        <Dropdown.Item
          onClick={() => {
            setSelectedOrder(order);
            setActive({ ...isActive, Delete: true });
          }}
        >
          Delete
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );

  const handleBulkDelete = async (orderIds) => {
    try {
      await Promise.all(orderIds.map((id) => deleteOrder(id)));
      await getListOrder(filters);
      toast.success("Xóa các đơn hàng đã chọn thành công");
    } catch (error) {
      toast.error("Xóa đơn hàng thất bại");
      throw error;
    }
  };

  return (
    <div className="manage-order">
      <div className="header">
        <div className="breadcrumb">
          <span className="breadcrumb-item">Dashboard</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-item active">Manage Order</span>
        </div>
      </div>
      <h1 className="page-title">Manage Order</h1>
      <div className="controls">
        <div className="controls-left">
          <div className="search-container">
            <input type="text" placeholder="Search order" value={tempFilters.search} onChange={(e) => setTempFilters({ ...tempFilters, search: e.target.value })} className="search-input" />
          </div>
        </div>
        <div className="controls-right">
          <select value={tempFilters.time} onChange={(e) => setTempFilters({ ...tempFilters, time: e.target.value })} className="time-filter">
            <option value={0}>By time</option>
            <option value={30}>Last 30 days</option>
            <option value={7}>Last 7 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <select value={tempFilters.deliveryStatus} onChange={(e) => setTempFilters({ ...tempFilters, deliveryStatus: e.target.value })} className="time-filter">
            <option value="null">Delivery State</option>
            <option value="PENDING">Pending</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="RETURNED">Return</option>
            <option value="FAILED">Failed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <select value={tempFilters.paymentStatus} onChange={(e) => setTempFilters({ ...tempFilters, paymentStatus: e.target.value })} className="time-filter">
            <option value="null">Payment Status</option>
            <option value="PENDING">Pending</option>
            <option value="SUCCESS">Success</option>
            <option value="RETURNED">Returned</option>
            <option value="FAILED">Failed</option>
          </select>
          <button className="controls-right__search" onClick={() => {
            getListOrder(tempFilters);
            setFilters(tempFilters);
          }}>Search</button>
          <button className="controls-right__clear" onClick={() => {
            setFilters({
              time: "0",
              paymentStatus: null,
              deliveryStatus: null,
              search: "",
              page: 0
            })
            setTempFilters({
              time: "0",
              paymentStatus: null,
              deliveryStatus: null,
              search: "",
              page: 0
            });
          }}>Clear</button>
        </div>
      </div>
      <div className="table-container">
        <AdminDataTable
          columns={orderColumns}
          data={ListOrder.Orders}
          rowKey={(order) => order.orderId}
          onRowClick={(order) => {
            setSelectedOrder(order);
            setActive({ ...isActive, Detail: true });
          }}
          renderActions={renderOrderActions}
          onBulkDelete={handleBulkDelete}
          emptyText="Không có đơn hàng nào"
        />
        <div className="pagination-container">
          <Pageable total={ListOrder.totalItems} currentPage={filters.page} pageChange={setFilters} />
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
