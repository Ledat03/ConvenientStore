import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import "../../assets/scss/checkout.scss";
import { fetchListPromotion } from "../../services/GetAPI";
import Logo from "../../assets/v-vnpay.svg";
import { addCheckout } from "../../services/UserSevice";
export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state.userInfo;
  const checkoutInfo = location.state?.checkoutItems;
  const [isShow, setShow] = useState(false);
  const open = () => setShow(true);
  const close = () => setShow(false);
  const [Promotion, setPromotion] = useState([]);
  const [Brand, setBrand] = useState([]);
  const [Category, setCategory] = useState([]);
  const [ProductName, setProductName] = useState([]);
  const [selectedPromotion, setSelected] = useState(null);
  const [Loading, setLoading] = useState(false);
  // const [Validate, setValidate] = useState();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    phoneNumber: "",
    discountCode: "",
    saveInfo: false,
    deliveryMethod: "ship",
    paymentMethod: "COD",
  });
  useEffect(() => {
    fetchRelativePromo();
  }, [checkoutInfo]);
  console.log(formData)
  const saveCheckout = async () => {
    let order = {
      userId: user.id,
      receiverName: formData.firstName + " " + formData.lastName,
      deliveryPhone: formData.phoneNumber,
      receiverAddress: formData.address + " , " + formData.city,
      deliveryMethod: formData.deliveryMethod,
      paymentMethod: formData.paymentMethod,
      payTotal: salePrices,
      promotionId: selectedPromotion !== null ? selectedPromotion.id : 0,
      items: checkoutInfo.map((item) => ({
        productId: item.product.productId,
        variantId: item.productVariant.id,
        quantity: item.quantity,
        unitPrice: item.productVariant.salePrice != 0 ? item.productVariant.salePrice : item.productVariant.price,
      })),
    };
    // const error = {};
    // if (!formData.firstName.trim()) error.firstName = "Bạn cần nhập họ !";
    // if (!formData.lastName.trim()) error.lastName = "Bạn cần nhập tên !";
    // if (!formData.address.trim()) error.address = "Bạn cần nhập địa chỉ !";
    // if (!formData.city.trim()) error.city = "Trường này không được trống !";
    // if (!formData.phoneNumber.trim()) error.phoneNumber = "Bạn cần nhập số điện thoại!";
    // if (error != undefined) {
    //   toast.error("Bạn cần nhập đầy đủ các trường thông tin");
    //   console.log(Validate);
    //   return;
    // }

    try {
      setLoading(true);
      const res = await addCheckout(order);
      if (formData.paymentMethod === "COD") {
        navigate("/ordercheck");
      } else {
        window.location.href = res.data;
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchRelativePromo = async () => {
    const res = await fetchListPromotion();
    setBrand([...new Set(checkoutInfo.map((cartdetail) => cartdetail.product.brand))]);
    setCategory([...new Set(checkoutInfo.map((cartdetail) => cartdetail.product.category))]);
    setProductName([...new Set(checkoutInfo.map((cartdetail) => cartdetail.product.productName))]);
    setPromotion(res.data);
  };

  const filterPromotion = Promotion.filter((promo) => {
    switch (promo.scope) {
      case "ALL":
        return true;
      case "CATEGORY":
        return promo.promotionCategories && promo.promotionCategories.some((cate) => Category.includes(cate.categoryName));
      case "BRAND": {
        return promo.promotionBrand && promo.promotionBrand.some((cate) => Brand.includes(cate.brand));
      }
      case "PRODUCT":
        return promo.promotionProducts && promo.promotionProducts.some((cate) => ProductName.includes(cate.productName));
    }
  });
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const fillCode = (code) => {
    setFormData((prev) => ({ ...prev, discountCode: code }));
  };
  const [PromotionReduce, setReduce] = useState(0);
  const truePrice = checkoutInfo.reduce((sum, item) => {
    return sum + item.productVariant.price * item.quantity;
  }, 0);
  const salePrices = checkoutInfo.reduce((sum, item) => {
    const temp = item.productVariant.salePrice == 0 ? item.productVariant.price : item.productVariant.salePrice;
    return sum + temp * item.quantity;
  }, -PromotionReduce);
  const reducePrice = truePrice - salePrices;
  return (
    <div className="checkout-container">
      <div className="checkout-form">
        <div>
          <section className="delivery-section">
            <h2>Phương thức giao hàng </h2>

            <div className="delivery-options">
              <label className={`delivery-option ${formData.deliveryMethod === "ship" ? "selected" : ""}`}>
                <input type="radio" name="deliveryMethod" value="ship" checked={formData.deliveryMethod === "ship"} onChange={handleInputChange} />
                <span className="option-text">Giao Hàng Tận Nhà</span>
                <span className="option-icon">🚚</span>
              </label>

              <label className={`delivery-option ${formData.deliveryMethod === "pickup" ? "selected" : ""}`}>
                <input type="radio" name="deliveryMethod" value="pickup" checked={formData.deliveryMethod === "pickup"} onChange={handleInputChange} />
                <span className="option-text">Lấy Tại Cửa Hàng</span>
                <span className="option-icon">🏪</span>
              </label>
            </div>

            <div className="address-form">
              <div className="form-row">
                <input
                  type="text"
                  name="firstName"
                  placeholder="Họ"
                  value={formData.firstName}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  className="form-input half-width"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Tên"
                  value={formData.lastName}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  className="form-input half-width"
                />
              </div>
              <input
                type="text"
                name="address"
                placeholder="Địa Chỉ Nhận Hàng"
                value={formData.address}
                onChange={(e) => {
                  handleInputChange(e);
                }}
                className="form-input"
              />
              <div className="form-row">
                <input
                  type="text"
                  name="city"
                  placeholder="Tỉnh (Thành Phố)"
                  value={formData.city}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  className="form-input half-width"
                />
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="Số Điện Thoại"
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  className="form-input half-width"
                />
              </div>
            </div>
          </section>
          <section className="payment-section">
            <h2>Phương thức thanh toán</h2>
            <div className="payment-options">
              <label className={`payment-option ${formData.paymentMethod === "COD" ? "selected" : ""}`}>
                <input type="radio" name="paymentMethod" value="COD" checked={formData.paymentMethod === "COD"} onChange={handleInputChange} />
                <span className="option-text">Trả Tiền Khi Nhận Hàng</span>
                <span className="option-icon">(COD)</span>
              </label>

              <label className={`payment-option ${formData.paymentMethod === "E_WALLET" ? "selected" : ""}`}>
                <input type="radio" name="paymentMethod" value="E_WALLET" checked={formData.paymentMethod === "E_WALLET"} onChange={handleInputChange} />
                <span className="option-text">Thanh toán trực tuyến </span>
                <img src={Logo} width={35} height={35} className="option-icon" />
                <span>VNPAY</span>
              </label>
            </div>
            <button className="pay-button" onClick={saveCheckout} disabled={Loading}>
              {Loading ? "Đang thực hiện..." : "Xác Nhận"}
            </button>
          </section>
        </div>
      </div>
      <div className="order-summary-checkout">
        {checkoutInfo.map((item) => {
          return (
            <div>
              <div className="product-item" key={item.cartDetailId}>
                <div className="product-image">
                  <img src={item.product.image} />
                  <span className="quantity-badge">{item.quantity}</span>
                </div>
                <div className="product-details">
                  <div>
                    <h3>{item.product.productName}</h3>
                  </div>
                  <div className="product-price">
                    <div className="product-previousPrice">
                      <p>{item.productVariant.salePrice != 0 ? item.productVariant.price.toLocaleString("vn-VN", { style: "currency", currency: "VND" }) : ""}</p>
                    </div>
                    <div className="product-currentPrice">{item.productVariant.salePrice != 0 ? item.productVariant.salePrice.toLocaleString("vn-VN", { style: "currency", currency: "VND" }) : item.productVariant.price.toLocaleString("vn-VN", { style: "currency", currency: "VND" })}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <Modal show={isShow} onHide={close}>
          <Modal.Header>Mã Khả Dụng Với Sản Phẩm Của Bạn</Modal.Header>
          <Modal.Body>
            {filterPromotion.length > 0 ? filterPromotion
              .filter((promotion) => {
                if (!promotion.active) return false;
                if (!promotion.promotionUser || promotion.promotionUser.length === 0) {
                  return true;
                }
                const isUserUsed = promotion.promotionUser.some((item) => item.userId === user?.id);
                return !isUserUsed;
              })
              .map((promo) => {
                const handleTotalPrice = () => {
                  const calSum = (item) => (item.productVariant.salePrice === 0 ? item.productVariant.price : item.productVariant.salePrice);
                  switch (promo.scope) {
                    case "ALL":
                      return checkoutInfo.reduce((sum, item) => sum + calSum(item) * item.quantity, 0);
                    case "BRAND":
                      return checkoutInfo.filter((item) => promo.promotionBrand?.some((brand) => brand.brand === item.product.brand)).reduce((sum, item) => sum + calSum(item) * item.quantity, 0);
                    case "CATEGORY":
                      return checkoutInfo.filter((item) => promo.promotionCategories.some((itm) => itm.categoryName === item.product.category)).reduce((sum, item) => sum + calSum(item) * item.quantity, 0);
                    case "PRODUCT":
                      return checkoutInfo.filter((item) => promo.promotionProducts.some((itm) => itm.productName === item.product.productName)).reduce((sum, item) => sum + calSum(item) * item.quantity, 0);
                  }
                };
                const totalCart = handleTotalPrice();
                if (totalCart >= promo.minOrderValue) {
                  return (
                    <div
                      key={promo.id}
                      className="promotion-checkout"
                      onClick={(e) => {
                        if (promo.type == "PERCENTAGE") {
                          const checkReduce = totalCart * (promo.discountValue / 100);
                          console.log(checkReduce);
                          if (checkReduce > promo.maxDiscount) {
                            setReduce(promo.maxDiscount);
                          } else {
                            setReduce(checkReduce);
                          }
                        } else if (promo.type == "FIXED_AMOUNT") {
                          setReduce(promo.maxDiscount);
                        }
                        fillCode(promo.code);
                        setSelected(promo);
                        close();
                      }}
                    >
                      <div className="promotion-left">
                        {promo.type != "PERCENTAGE" ? (
                          <span>
                            Giảm
                            <p>{promo.maxDiscount.toLocaleString("vn-VN", { style: "currency", currency: "VND" })}</p>
                          </span>
                        ) : (
                          <div className="promotion-left__text">
                            <p>Giảm {promo.discountValue} %</p> <span>Tối đa {promo.maxDiscount.toLocaleString("vn-VN", { style: "currency", currency: "VND" })}</span>
                          </div>
                        )}
                      </div>
                      <div className="promotion-right">
                        <div className="promotion-header">
                          <div className="expiry-badge">HSD: {new Date(promo.endDate).toLocaleDateString("vi-Vn")}</div>
                        </div>

                        <h3 className="promotion-title">{promo.name}</h3>
                        <p className="promotion-description">{promo.description}</p>

                        <div className="promotion-footer">
                          <div className="promo-info">
                            <span>Cho đơn tối thiểu {promo.minOrderValue.toLocaleString("vn-VN", { style: "currency", currency: "VND" })}</span>
                            <span className="promo-code">{promo.code}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              }) : <div>
              <p className="promotion-warn">Hiện không có phiếu giảm giá khả dụng</p>
            </div>
            }
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={close} className="promotion-close-btn">
              Đóng
            </Button>
          </Modal.Footer>
        </Modal>
        <button className="coupon-btn" onClick={open}>
          Mã Giảm Giá Khả Dụng
        </button>
        <div className="order-totals">
          <div className="total-row">
            <span>Tạm Tính</span>
            <span>{truePrice.toLocaleString("vn-VN", { style: "currency", currency: "VND" })}</span>
          </div>
          <div className="total-row">
            <span>Voucher</span>
            <span className="shipping-note">{selectedPromotion == null ? "Chưa áp Voucher nào" : selectedPromotion.code}</span>
          </div>
          {selectedPromotion != null && (
            <div className="total-row">
              <span>Giảm từ Voucher </span>
              <span>-{PromotionReduce.toLocaleString("vn-VN", { style: "currency", currency: "VND" })}</span>
            </div>
          )}
          <div className="total-row">
            <span>Số tiền được giảm </span>
            <span>-{reducePrice.toLocaleString("vn-VN", { style: "currency", currency: "VND" })}</span>
          </div>
          <div className="total-row final-total">
            <span>Tổng Tiền</span>
            <div className="total-amount">
              <span className="amount">{salePrices.toLocaleString("vn-VN", { style: "currency", currency: "VND" })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
