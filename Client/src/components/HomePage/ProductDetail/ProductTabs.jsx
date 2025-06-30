import { useState } from "react";
import "../../../assets/scss/productdetail/productdetail.scss";

const ProductTabs = ({ product }) => {
  const [activeTab, setActiveTab] = useState("description");
  return (
    <div className="product-tabs">
      <div className="tab-navigation">
        <button className={`tab-btn ${activeTab === "description" ? "active" : ""}`} onClick={() => setActiveTab("description")}>
          Mô tả
        </button>
        <button className={`tab-btn ${activeTab === "specification" ? "active" : ""}`} onClick={() => setActiveTab("specification")}>
          Thông tin sản phẩm
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "description" && (
          <div className="description-content">
            <div className="description-section">
              <p className="description-text">{product.productDescription}</p>
            </div>
          </div>
        )}

        {activeTab === "specification" && (
          <div className="specification-content">
            <div key={product.productId} className="spec">
              <div className="spec__Info">
                <span className="spec-label">Xuất Xứ</span>
                <span className="spec-value">{product.origin}</span>
              </div>
              <div className="spec__Info">
                {" "}
                <span className="spec-label">Thành phần</span>
                <span className="spec-value">{product.ingredient}</span>
              </div>
              <div className="spec__Info">
                {" "}
                <span className="spec-label">Hướng dẫn sử dụng</span>
                <span className="spec-value">{product.howToUse}</span>
              </div>
              <div className="spec__Info">
                {" "}
                <span className="spec-label">Hướng dẫn bảo quản</span>
                <span className="spec-value">{product.preserve}</span>
              </div>
              <div></div>
              <div></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
