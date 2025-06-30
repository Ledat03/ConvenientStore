import "../../../assets/scss/productdetail/productdetail.scss";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
const ProductGallery = ({ productData, Variant, Unit }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [fillVariant, setFillVariant] = useState({});
  const v = productData.productVariant.find((variant) => variant.calUnit == Unit);
  useEffect(() => {
    setFillVariant(v);
  }, [Unit]);

  return (
    <div className="product-gallery">
      <div className="main-image">
        <img alt="Product" className="main-img" src={selectedImage == null || selectedImage > fillVariant.productImage.length - 1 ? productData.image : fillVariant.productImage[selectedImage]} />
        <div className="navigation-arrows">
          <button className="nav-arrow-left">
            <FaArrowLeft />
          </button>
          <button className="nav-arrow-right">
            <FaArrowRight />
          </button>
        </div>
      </div>
      <div className="thumbnail-list">
        {fillVariant &&
          fillVariant.productImage?.map((image, index) => (
            <div key={index} className={index === selectedImage ? "thumbnail active" : "thumbnail"} onClick={() => setSelectedImage(index)}>
              <img src={image} alt={`Product ${index + 1}`} className="thumbnail-img" />
            </div>
          ))}
      </div>
    </div>
  );
};

export default ProductGallery;
