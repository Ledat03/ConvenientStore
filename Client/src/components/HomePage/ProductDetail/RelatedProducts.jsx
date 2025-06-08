import "../../../assets/scss/productdetail/productdetail.scss";

const RelatedProducts = () => {
  const relatedProducts = [
    {
      id: 1,
      title: 'VINGLI 56" Modern Sofa, Small Corduroy Couch Deep Seat',
      category: "Living room • Armchair",
      price: 259.0,
      originalPrice: 440.0,
      discount: "Save 50%",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 2,
      title: "AIA Tri-Fold Wooden effect legSofa",
      category: "Living room • Armchair",
      price: 189.0,
      originalPrice: 340.0,
      discount: "Save 44%",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 3,
      title: "Milano Accent Chair Modern Retro Leisure Chair with Solid Wood Frame",
      category: "Living room • Armchair",
      price: 239.0,
      originalPrice: 410.0,
      discount: "Save 40%",
      image: "/placeholder.svg?height=200&width=200",
    },
  ];

  return (
    <div className="related-products">
      <div className="section-header">
        <h2 className="section-title">Các sản phẩm liên quan</h2>
        <div className="navigation">
          <button className="nav-btn">‹</button>
          <button className="nav-btn">›</button>
        </div>
      </div>

      <div className="products-grid">
        {relatedProducts.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image || "/placeholder.svg"} alt={product.title} className="product-image" />
            <div className="product-details">
              <h3 className="product-title">{product.title}</h3>
              <p className="category">{product.category}</p>
              <div className="price-info">
                <span className="current-price">${product.price.toFixed(2)}</span>
                <span className="original-price">${product.originalPrice.toFixed(2)}</span>
                <span className="discount">{product.discount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
