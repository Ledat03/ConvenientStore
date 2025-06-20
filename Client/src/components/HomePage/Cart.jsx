import React, { useState, useEffect } from "react";
import "../../assets/scss/cart.scss";

import { ViewCart, DeleteCartDetail } from "../../services/UserSevice";
import { Link, useNavigate } from "react-router-dom";
import LoadingAnimation from "../common/LoadingAnimation";
const Cart = () => {
  const [UserInfo, setUserInfo] = useState({});
  const navigate = useNavigate();
  const [CartInfo, setCart] = useState(null);
  const [CartState, setState] = useState(null);
  const [Loading, setLoading] = useState(true);
  const handleCheckout = () => {
    const selectedItems = CartInfo?.cartDetailList.filter((item) => item.selected);
    navigate("/checkout", { state: { checkoutItems: selectedItems, userInfo: UserInfo } });
  };
  const selectedItemsCount = CartInfo?.cartDetailList.filter((item) => item.selected).length;
  const calSavePrice = (salePrice, price) => {
    let sale = ((salePrice - price) / price) * 100;
    return Math.round(sale);
  };
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
    console.log(res);
    if (res.data.data.cartDetailList != undefined) {
      const selectItems = res.data.data.cartDetailList.map((item) => ({ ...item, selected: false }));
      const temp = res.data.data;
      setCart({ ...temp, cartDetailList: selectItems });
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    await DeleteCartDetail(id);
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
    setCart({ ...CartInfo, sumQuantity: total, cartDetailList: changeQuantity });
  };
  const handleToggleSelect = (id) => {
    const setSelected = CartInfo?.cartDetailList?.map((item) => (item.cartDetailId === id ? { ...item, selected: !item.selected } : item));
    setCart({ ...CartInfo, cartDetailList: setSelected });
  };

  const calculateSubtotal = () =>
    CartInfo?.cartDetailList
      ?.filter((item) => item.selected)
      .reduce((total, item) => {
        const calPrice = item.productVariant.salePrice != 0 ? item.productVariant.salePrice : item.productVariant.price;
        return total + calPrice * item.quantity;
      }, 0);
  const subtotal = calculateSubtotal();
  const total = () =>
    CartInfo?.cartDetailList
      ?.filter((item) => item.selected)
      .reduce((total, item) => {
        return total + item.productVariant.price * item.quantity;
      }, 0);
  const totalPrice = total();
  const reducePrice = totalPrice - subtotal;
  if (Loading) {
    return <LoadingAnimation />;
  }
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
                  {CartInfo?.cartDetailList?.map((item, index) => (
                    <div key={index} className="cart-item">
                      <div className="cart-item-left">
                        <input type="checkbox" checked={item.selected} onChange={() => handleToggleSelect(item.cartDetailId)} />
                        <img src={item.productVariant.productImage[0]} alt={item.name} className="item-img" />
                      </div>

                      <div className="cart-item-content">
                        <h3 className="item-name">{item.product.productName}</h3>
                        <div className="item-meta">
                          <span>Hãng : {item.product.brand}</span>
                          <span>Đơn vị tính: {item.productVariant.calUnit}</span>
                        </div>
                      </div>
                      <div className="cart-item-right">
                        <div className="price-area">
                          {item.productVariant.salePrice == 0 ? <span>{item.productVariant.price.toLocaleString("vn-VN", { style: "currency", currency: "VND" })}</span> : <s>{item.productVariant.price.toLocaleString("vn-VN", { style: "currency", currency: "VND" })}</s>}

                          <span>{item.productVariant.salePrice != 0 && item.productVariant.salePrice.toLocaleString("vn-VN", { style: "currency", currency: "VND" })}</span>
                          {item.productVariant.salePrice != 0 ? <div className="save-text">Save {calSavePrice(item.productVariant.price, item.productVariant.salePrice)}%</div> : <div></div>}
                        </div>

                        <div className="quantity-area">
                          <span>Quantity:</span>
                          <div className="qty-control">
                            <button onClick={() => handleQuantityDown(item.cartDetailId, item.quantity)}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => handleQuantityUp(item.cartDetailId, item.quantity)}>+</button>
                          </div>
                        </div>

                        <button
                          className="remove-btn"
                          onClick={() => {
                            if (confirm("Bạn chắc chắn xóa sản phẩm này không ?\nMọi thao tác trước đó với giỏ hàng của bạn sẽ bị hoàn tác")) {
                              handleDelete(item.cartDetailId);
                            }
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
                <div className="summary-info">
                  <h3>Tổng Quan</h3>
                </div>
              </div>
              <div className="cart-summary">
                <div className="cart-total">
                  <span>Tạm tính giỏ hàng : </span>
                  <strong>{totalPrice.toLocaleString("vn-VN", { style: "currency", currency: "VND" })}</strong>
                </div>
                <div>{selectedItemsCount} Sản Phẩm Đã Chọn</div>
                <div> Tổng tiền giảm giá {reducePrice.toLocaleString("vn-VN", { style: "currency", currency: "VND" })}</div>
                <div className="cart-total">
                  <span>Tổng tiền : </span>
                  <strong>{subtotal.toLocaleString("vn-VN", { style: "currency", currency: "VND" })}</strong>
                </div>
                <div
                  className="checkout-btn"
                  onClick={(e) => {
                    handleCheckout();
                  }}
                >
                  Thanh Toán Đơn Hàng
                </div>
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
