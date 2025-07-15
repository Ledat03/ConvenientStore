import { Modal, Button, Row, Col, Card, Badge } from "react-bootstrap";
import "../../../assets/scss/viewProduct.scss";

const ViewProduct = (props) => {
  // Tách các thông tin sản phẩm thành biến riêng
  const productId = props.InfoItem.productId;
  const productName = props.InfoItem.productName;
  const howToUse = props.InfoItem.howToUse;
  const origin = props.InfoItem.origin;
  const ingredient = props.InfoItem.ingredient;
  const category = props.InfoItem.category;
  const subCategory = props.InfoItem.subCategory;
  const preserve = props.InfoItem.preserve;
  const productDescription = props.InfoItem.productDescription;
  const image = props.InfoItem.image;
  const basicInfo = [
    { label: "ID Sản phẩm", value: productId },
    { label: "Tên sản phẩm", value: productName },
    { label: "Xuất xứ", value: origin },
    { label: "Danh mục chính", value: category },
    { label: "Danh mục nhánh", value: subCategory },
  ];

  const detailInfo = [
    { label: "Cách sử dụng", value: howToUse },
    { label: "Thành phần", value: ingredient },
    { label: "Bảo quản", value: preserve },
    { label: "Mô tả", value: productDescription },
  ];

  const additionalInfo = {
    status: "Đang bán",
    createdDate: new Date().toLocaleDateString("vi-VN"),
    updatedDate: new Date().toLocaleDateString("vi-VN"),
  };

  return (
    <Modal size="xl" show={props.isShowView} onHide={props.closeView} className="product-view-modal">
      <Modal.Header closeButton className="product-modal-header">
        <div className="product-header-content">
          <div className="product-header-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div className="product-header-text">
            <Modal.Title>Thông tin sản phẩm</Modal.Title>
            <p className="product-header-subtitle">Chi tiết đầy đủ về sản phẩm</p>
          </div>
        </div>
      </Modal.Header>

      <Modal.Body className="product-modal-body">
        <Row>
          <Col lg={6}>
            <Card className="product-image-card mb-4">
              <Card.Body className="text-center">
                <div className="product-image-placeholder">
                  <img src={image} alt="" />
                </div>
              </Card.Body>
            </Card>

            <Card className="product-basic-info-card">
              <Card.Header className="product-card-header">
                <h5 className="product-section-title">Thông tin cơ bản</h5>
              </Card.Header>
              <Card.Body>
                {basicInfo.map((item, index) => (
                  <div key={index} className="product-info-row">
                    <div className="product-info-label">
                      <span className="product-info-icon">{item.icon}</span>
                      <span className="product-label-text">{item.label}:</span>
                    </div>
                    <div className="product-info-value">{item.value || "Chưa có thông tin"}</div>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6}>
            <Card className="product-detail-info-card mb-4">
              <Card.Header className="product-card-header">
                <h5 className="product-section-title">Thông tin chi tiết</h5>
              </Card.Header>
              <Card.Body>
                {detailInfo.map((item, index) => (
                  <div key={index} className="product-detail-row">
                    <div className="product-detail-label">
                      <span className="product-detail-icon">{item.icon}</span>
                      <span className="product-detail-text">{item.label}:</span>
                    </div>
                    <div className="product-detail-value">{item.value || "Chưa có thông tin"}</div>
                  </div>
                ))}
              </Card.Body>
            </Card>

            <Card className="product-additional-card">
              <Card.Header className="product-card-header">
                <h5 className="product-section-title">Thông tin bổ sung</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col sm={6}>
                    <div className="product-additional-item">
                      <span className="product-additional-label">Trạng thái:</span>
                      <Badge bg="success" className="product-status-badge">
                        {additionalInfo.status}
                      </Badge>
                    </div>
                  </Col>
                  <Col sm={6}></Col>
                  <Col sm={6}>
                    <div className="product-additional-item">
                      <span className="product-additional-label">Ngày tạo:</span>
                      <span className="product-additional-value">{additionalInfo.createdDate}</span>
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="product-additional-item">
                      <span className="product-additional-label">Cập nhật cuối:</span>
                      <span className="product-additional-value">{additionalInfo.updatedDate}</span>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer className="product-modal-footer">
        <Button variant="secondary" onClick={props.closeView} className="product-back-btn">
          Quay lại
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewProduct;
