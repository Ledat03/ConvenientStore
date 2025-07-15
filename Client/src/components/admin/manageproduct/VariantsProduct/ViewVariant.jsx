import { Modal, Button, Row, Col, Card } from "react-bootstrap";
import "../../../../assets/scss/viewProduct.scss";

const ViewVariant = (props) => {
  const id = props.Variant.id;
  const calUnit = props.Variant.calUnit;
  const price = props.Variant.price;
  const salePrice = props.Variant.salePrice;
  const skuCode = props.Variant.skuCode;
  const stock = props.Variant.stock;
  const isActive = props.Variant.isActive;
  const productId = props.Variant.productId;
  const image = [props.Variant.productImage];
  const basicInfo = [
    { label: "ID Biến thể", value: id },
    { label: "Đơn vị tính", value: calUnit },
    { label: "Mã SKU", value: skuCode },
    { label: "Trạng thái hiện tại", value: isActive },
  ];
  const detailInfo = [
    { label: "Giá gốc", value: price },
    { label: "Giá khuyến mãi", value: salePrice },
    { label: "ID sản phẩm", value: productId },
    { label: "Số lượng tồn kho", value: stock },
  ];
  return (
    <Modal size="xl" show={props.isShowVariant} onHide={props.closeVariant} className="product-view-modal">
      <Modal.Header closeButton className="product-modal-header">
        <div className="product-header-content">
          <div className="product-header-text">
            <Modal.Title>Thông tin biến thể</Modal.Title>
            <p className="product-header-subtitle">Chi tiết đầy đủ về biến thể</p>
          </div>
        </div>
      </Modal.Header>

      <Modal.Body className="product-modal-body">
        {" "}
        <Col lg={15}>
          <Card className="product-image-card mb-4">
            <Card.Body className="text-center">
              <div className="product-image-placeholder">
                <img src={image[0]} alt="" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Row>
          <Col lg={6}>
            <Card className="product-basic-info-card">
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
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer className="product-modal-footer">
        <Button variant="secondary" onClick={props.closeVariant} className="product-back-btn">
          Quay lại
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewVariant;
