import "../../../assets/scss/productdetail/productdetail.scss";
import { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";

const ProductGallery = ({ productData, Unit }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentImages, setCurrentImages] = useState([]);

  useEffect(() => {
    if (!productData) return;

    const variant = productData.productVariant?.find(
      (v) => v.calUnit === Unit
    );

    if (variant && variant.productImage?.length > 0) {
      setCurrentImages(variant.productImage);
    } else {

      setCurrentImages([productData.image]);
    }

    setActiveIndex(0);
  }, [Unit, productData]);

  if (!currentImages || currentImages.length === 0) return null;

  return (
    <div className="product-gallery">
      <Carousel
        activeIndex={activeIndex}
        onSelect={(selectedIndex) => setActiveIndex(selectedIndex)}
        interval={null}
      >
        {currentImages.map((img, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100 main-img"
              src={img}
              alt={`Slide ${index}`}
            />
          </Carousel.Item>
        ))}
      </Carousel>


      <div className="thumbnail-list">
        {currentImages.map((image, index) => (
          <div
            key={index}
            className={
              index === activeIndex
                ? "thumbnail active"
                : "thumbnail"
            }
            onClick={() => setActiveIndex(index)}
          >
            <img
              src={image}
              alt={`Thumbnail ${index}`}
              className="thumbnail-img"
            />
          </div>
        ))}
      </div>

    </div>
  );
};

export default ProductGallery;