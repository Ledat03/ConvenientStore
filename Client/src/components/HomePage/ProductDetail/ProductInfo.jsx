import "../../../assets/scss/productdetail/productdetail.scss";
const ProductInfo = ({ product, quantity, setQuantity, Unit, setUnit }) => {
  return (
    <div className="product-info">
      <h1 className="product-title">
        {product.productName} - {Unit}
      </h1>

      <div className="price-section">
        <span className="current-price">{product.productVariant[0].price}VND</span>
        <span className="original-price">{product.productVariant[0].salePrice}VND</span>
        <span className="discount-badge">{product.discount}</span>
      </div>

      <div className="quantity-section">
        <label className="label">Số Lượng</label>
        <div className="quantity-controls">
          <button className="quantity-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
            -
          </button>
          <span className="quantity-value">{quantity}</span>
          <button className="quantity-btn" onClick={() => setQuantity(quantity + 1)}>
            +
          </button>
        </div>
        <span className="stock-info"></span>
      </div>

      <div className="color-section">
        <h3 className="section-title">Đơn vị tính</h3>
        <div className="color-options">
          {product.productVariant.map((variant, index) => (
            <div key={index} className={`color-option ${variant.calUnit === Unit ? "selected" : ""}`} onClick={() => setUnit(variant.calUnit)}>
              <span>{variant.calUnit}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="action-buttons">
        <button className="add-to-cart">Thêm Vào Giỏ Hàng</button>
        <button className="buy-now">Mua Ngay</button>
      </div>

      <div className="info-section">
        <h3 className="info-title">THÔNG TIN MUA HÀNG</h3>
        <div className="info-text">🚚 GIAO TẬN NHÀ , NHẬN TẬN TAY</div>
        <div className="info-text">📅 GIAO NHẬN TRONG NGÀY</div>
      </div>
    </div>
  );
};

export default ProductInfo;
