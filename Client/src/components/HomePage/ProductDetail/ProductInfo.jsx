import "../../../assets/scss/productdetail/productdetail.scss";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AddToCart } from "../../../services/UserSevice";
import { Button } from "react-bootstrap";
const ProductInfo = ({ product, quantity, setQuantity, Unit, setUnit }) => {
  const [userData, setUserData] = useState({});
  const [SelectedItem, setItem] = useState(0);
  useEffect(() => {
    IsLogIn();
  }, []);
  const Discount = (product.productVariant[SelectedItem]?.salePrice / product.productVariant[SelectedItem]?.price).toFixed(1) * 10;
  const IsLogIn = () => {
    const checkUser = localStorage?.getItem("user");
    if (checkUser != null) {
      const parse = JSON.parse(checkUser);
      setUserData(parse);
    }
  };
  const handleAddToCart = async (variantId, productId) => {
    try {
      const info = {
        userId: userData.id,
        variantId: variantId,
        productId: productId,
        quantity: quantity,
      };
      const response = await AddToCart(info);
      if (response) {
        console.log(response);
        toast.success("Thêm Vào Giỏ Hàng Thành Công");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data);
      throw error;
    }
  };
  return (
    <div className="product-info">
      <h1 className="product-title">
        {product.productName} - {Unit}
      </h1>

      <div className="price-section">
        <span className="current-price">{product.productVariant[SelectedItem]?.price.toLocaleString("vn-VN", { style: "currency", currency: "VND" })}</span>
        {product.productVariant[SelectedItem].salePrice != 0 && (
          <div>
            <span className="original-price">{product.productVariant[SelectedItem].salePrice.toLocaleString("vn-VN", { style: "currency", currency: "VND" })}</span>
            <span className="discount-badge">SAVE {Discount}%</span>
          </div>
        )}
      </div>

      <div className="quantity-section">
        <label className="label">Số Lượng</label>
        <div className="quantity-controls">
          <button className="quantity-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
            -
          </button>
          <span className="quantity-value">{quantity}</span>
          <button
            className="quantity-btn"
            onClick={(e) => {
              if (quantity >= product.productVariant[SelectedItem].stock) {
                return;
              }
              setQuantity(quantity + 1);
            }}
          >
            +
          </button>
        </div>
        <span className="stock-info">Số Lượng Còn Lại : </span>
        <span>{product.productVariant[SelectedItem].stock}</span>
      </div>

      <div className="color-section">
        <h3 className="section-title">Đơn vị tính</h3>{" "}
        <div className="color-options">
          {product.productVariant.map((variant, index) => (
            <div
              key={index}
              className={`color-option ${variant.calUnit === Unit ? "selected" : ""}`}
              onClick={() => {
                setItem(index);
                setUnit(variant.calUnit);
              }}
            >
              <span>{variant.calUnit}</span>
            </div>
          ))}{" "}
        </div>{" "}
      </div>
      <div className="action-buttons">
        {product.productVariant[SelectedItem].stock != 0 ? (
          <button
            className="add-to-cart"
            onClick={() => {
              handleAddToCart(product.productVariant[SelectedItem].id, product.productId);
            }}
          >
            Thêm Vào Giỏ Hàng
          </button>
        ) : (
          <Button className="add-to-cart" disabled>
            Hết Hàng
          </Button>
        )}
      </div>

      <div className="info-section">
        <h3 className="info-title">THÔNG TIN MUA HÀNG</h3>
        <div className="info-text"> GIAO TẬN NHÀ , NHẬN TẬN TAY</div>
        <div className="info-text">GIAO NHẬN TRONG NGÀY</div>
      </div>
      {console.log(quantity + " VariantId " + product.productVariant[SelectedItem].id + "productId " + product.productId)}
    </div>
  );
};

export default ProductInfo;
