import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
const ProductCard = ({ products }) => {
  const calSavePrice = (salePrice, price) => {
    let sale = ((salePrice - price) / price) * 100;
    return Math.round(sale);
  };
  return (
    <div className="product-grid">
      {products.map((item, index) => {
        console.log(item);
        return item.productVariant.map((variant, idx) => {
          console.log(variant);
          return (
            <Link to={`product/${item.productId}?variant=${variant.calUnit}`} className="product-card" key={idx}>
              {variant.stock && <div className={`product-card__badge ${variant.stock != 0 ? "product-card__badge--low-stock" : "product-card__badge--out-stock"}`}>{variant.stock > 0 ? "Còn Hàng" : "Hết Hàng"}</div>}
              <div className="product-card__image-container">
                <img src={variant.productImage[0] || "/placeholder.svg?height=200&width=200"} alt={item.productName} className="product-card__image" />
              </div>
              <div className="product-card__info">
                <h3 className="product-card__name">{item.productName}</h3>
                <div className="product-card__tags">
                  <span className="product-card__tag">{item.subCategory}</span>
                  <span className="product-card__tag">{item.brand}</span>
                  <span className="product-card__tag">{variant.calUnit}</span>
                </div>

                {variant.salePrice != 0 ? (
                  <div className="product-card__pricing">
                    <span className="product-card__current-price">{variant.salePrice.toLocaleString("vn-VN", { style: "currency", currency: "VND" })}VND</span>
                    <span className="product-card__original-price">{variant.price}VND</span>
                    {variant.salePrice != 0 && (
                      <>
                        <span className="product-card__discount">Save {calSavePrice(variant.price, variant.salePrice)}%</span>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="product-card__pricing">
                    <span className="product-card__current-price">{variant.price}VND</span>
                  </div>
                )}

                <div className="Card-ButtonGroup">
                  <Button className="Card-Button">Thêm vào giỏ hàng</Button>
                  {/* <Button className="Card-Button">Mua</Button> */}
                </div>
              </div>
            </Link>
          );
        });
      })}
    </div>
  );
};

export default ProductCard;
