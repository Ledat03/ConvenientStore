import React, { useState, useEffect } from "react";
import "../../assets/scss/cart.scss";
import { ViewCart, DeleteCartDetail } from "../../services/UserSevice";
import { Link } from "react-router-dom";
const Cart = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      name: 'VINOLI 56" Modern Sofa, Small Corduroy Couch Deep Seat',
      image: "https://readdy.ai/api/search-image?query=Modern%20beige%20small%20corduroy%20couch%20with%20deep%20seat&width=120&height=120&seq=1&orientation=squarish",
      originalPrice: 299.0,
      price: 259.0,
      savePercent: 20,
      quantity: 1,
      size: "S",
      color: "Beige White",
      remaining: 2,
      selected: true,
    },
    {
      id: 2,
      name: "Fabric Recliner Chair Single Sofa",
      image: "https://readdy.ai/api/search-image?query=Modern%20teal%20fabric%20recliner%20chair%20single%20sofa&width=120&height=120&seq=2&orientation=squarish",
      originalPrice: 140.0,
      price: 109.0,
      savePercent: 20,
      quantity: 1,
      size: "S",
      color: "White/Chocolate",
      remaining: 4,
      selected: true,
    },
  ]);
  const [UserInfo, setUserInfo] = useState({});
  const [couponCode, setCouponCode] = useState("TAKE100");
  const [appliedCoupon, setAppliedCoupon] = useState(true);
  const [CartInfo, setCart] = useState(null);
  const [CartState, setState] = useState(null);
  useEffect(() => {
    const temp = localStorage.getItem("user");
    const parse = JSON.parse(temp);
    setUserInfo(parse);
    if (parse && parse.id) {
      handleCart(parse.id);
    }
  }, [CartState]);
  const handleCart = async (info) => {
    const res = await ViewCart(info);
    console.log(res.data.data);
    setCart(res.data.data);
  };
  const handleDelete = async (id) => {
    const res = await DeleteCartDetail(id);
    const data = await ViewCart(UserInfo.id);
    if (data != null) {
      setCart(data.data.data);
    } else {
      setCart(null);
    }
    setState(Date.now());
  };
  console.log(CartInfo);
  const handleQuantityUp = (id, newQuantity) => {
    if (newQuantity < 1) return;
    const changeQuantity = CartInfo.cartDetailList.map((item) => {
      if (item.cartDetailId === id) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    const total = changeQuantity.reduce((sum, item) => sum + item.quantity, 0);
    console.log(total);
    setCart({ ...CartInfo, sumQuantity: total, cartDetailList: changeQuantity });
  };
  const handleQuantityDown = (id, newQuantity) => {
    if (newQuantity <= 1) return;
    const changeQuantity = CartInfo.cartDetailList.map((item) => {
      if (item.cartDetailId === id) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    const total = changeQuantity.reduce((sum, item) => sum + item.quantity, 0);
    console.log(total);
    setCart({ ...CartInfo, sumQuantity: total, cartDetailList: changeQuantity });
  };
  const handleToggleSelect = (id) => setItems(items.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item)));

  const calculateSubtotal = () => items.filter((item) => item.selected).reduce((total, item) => total + item.price * item.quantity, 0);

  const subtotal = calculateSubtotal();
  const shippingCost = "TBA";
  const discount = -100.0;
  const total = subtotal + discount;
  const selectedItemsCount = items.filter((item) => item.selected).length;

  return (
    <div className="cart-container">
      {CartInfo && CartInfo?.cartDetailList?.length != 0 ? (
        <div className="cart-inner">
          <div className="cart-columns">
            <div className="cart-left">
              <div className="cart-box">
                <h1 className="cart-heading">Giỏ Hàng Của Bạn </h1>
                <div className="cart-controls">
                  <Link to="/" className="cart-link">
                    ← Tiếp tục mua sắm
                  </Link>
                </div>

                <div className="cart-items">
                  {CartInfo.cartDetailList?.map((item, index) => (
                    <div key={index} className="cart-item">
                      <div className="cart-item-left">
                        <input type="checkbox" checked={item.selected} onChange={() => handleToggleSelect(item.id)} />
                        <img src={item.productVariant.productImage[0]} alt={item.name} className="item-img" />
                      </div>

                      <div className="cart-item-content">
                        <h3 className="item-name">{item.product.productName}</h3>
                        <div className="item-meta">
                          <span>Size: {item.size}</span>
                          <span>Đơn vị tính: {item.productVariant.calUnit}</span>
                        </div>
                      </div>

                      <div className="cart-item-right">
                        <div className="price-area">
                          {item.productVariant.salePrice == 0 ? <span>{item.productVariant.price.toLocaleString("vn-VN", { style: "currency", currency: "VND" })}</span> : <s>{item.productVariant.price.toLocaleString("vn-VN", { style: "currency", currency: "VND" })}</s>}

                          <span>{item.productVariant.salePrice != 0 && item.productVariant.salePrice.toLocaleString("vn-VN", { style: "currency", currency: "VND" })}</span>
                          {item.productVariant.salePrice != 0 ? <div className="save-text">Save {item.savePercent}%</div> : <div></div>}
                        </div>

                        <div className="quantity-area">
                          <span>Quantity:</span>
                          <div className="qty-control">
                            <button onClick={() => handleQuantityDown(item.cartDetailId, item.quantity)}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => handleQuantityUp(item.cartDetailId, item.quantity)}>+</button>
                          </div>
                        </div>
                        {console.log(item.quantity)}
                        <button
                          className="remove-btn"
                          onClick={() => {
                            handleDelete(item.cartDetailId);
                          }}
                        >
                          Xóa Khỏi Giỏ Hàng
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="cart-right">
              <div className="summary-box">
                <h3>Coupon</h3>
                <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Enter coupon" />
                {appliedCoupon && (
                  <p>
                    Coupon <strong>{couponCode}</strong> applied - Save $100!
                  </p>
                )}

                <div className="summary-info">
                  <h3>Summary</h3>
                  <div>Subtotal: ${subtotal.toFixed(2)}</div>
                  <div>Shipping: {shippingCost}</div>
                  <div>Discount: ${discount.toFixed(2)}</div>
                  <div className="final-total">Total: ${total.toFixed(2)}</div>
                </div>
              </div>

              <div className="cart-summary">
                <div>{selectedItemsCount} items selected</div>
                <div className="cart-total">
                  <span>Total: </span>
                  <strong>${total.toFixed(2)}</strong>
                </div>
                <button className="checkout-btn">Thanh Toán Đơn Hàng</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <span>Hiện tại bạn không có sản phẩm</span>
          <br />
          <span>Bạn hãy thử chọn lựa các sản phẩm trong cửa hàng </span>
        </div>
      )}
    </div>
  );
};

export default Cart;
