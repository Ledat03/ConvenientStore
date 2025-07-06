import { toast } from "react-toastify";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import _ from "lodash";
import { UpdateVariantItem } from "../../../../services/GetAPI";
const UpdateVariant = (props) => {
  const [Price, setPrice] = useState("");
  const [SalePrice, setSalePrice] = useState("");
  const [Stock, setStock] = useState("");
  const [Image, setImage] = useState([]);
  const [Unit, setUnit] = useState("");
  const [SKUCode, setSKUCode] = useState("");
  const [IsActive, setActive] = useState("Draft");
  const [ImagePreviewURL, setImagePreviewURL] = useState([]);
  useEffect(() => {
    if (!_.isEmpty(props.Variant)) {
      setPrice(props.Variant.price);
      setSalePrice(props.Variant.salePrice);
      setStock(props.Variant.stock);
      setUnit(props.Variant.calUnit);
      setSKUCode(props.Variant.skuCode);
      setActive(props.Variant.isActive);
    }
  }, [props.isShowVariant]);

  const Add = async () => {
    const formData = new FormData();
    formData.append("variantId", props.Variant.id);
    formData.append("productId", props.InfoItem.productId);
    formData.append("price", Price);
    formData.append("salePrice", SalePrice);
    formData.append("calUnit", Unit);
    formData.append("skuCode", SKUCode);
    formData.append("stock", Stock);
    formData.append("isActive", IsActive);
    Image.forEach((item) => {
      formData.append(`productImage`, item);
    });
    try {
      await UpdateVariantItem(formData);
      toast.success("Sửa thành công");
      props.getVariants(props.InfoItem.productId);
      props.closeVariant();
    } catch (e) {
      toast.error("có lỗi xảy ra", e);
      throw e;
    }
  };
  console.log(props.Variant);
  const handleImage = (e) => {
    const files = Array.from(e.target.files);
    setImage(files);
    const previewImage = files.map((image) => URL.createObjectURL(image));
    setImagePreviewURL(previewImage);
  };
  return (
    <>
      <Modal size="xl" show={props.isShowVariant} onHide={props.closeVariant}>
        <Modal.Header closeButton> Sửa thông tin sản phẩm </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Tên sản phẩm</Form.Label>
              <Form.Label>{props.InfoItem.productName}</Form.Label>
            </Form.Group>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridPrice">
                <Form.Label>Giá</Form.Label>
                <Form.Control type="text" placeholder="Nhập Giá Sản Phẩm" onChange={(e) => setPrice(e.target.value)} defaultValue={props.Variant.price} />
              </Form.Group>
              <Form.Group as={Col} controlId="formSalePrice">
                <Form.Label>Giá Khuyến mãi</Form.Label>
                <Form.Control type="text" placeholder="Nhập Giá Khuyến mãi" onChange={(e) => setSalePrice(e.target.value)} defaultValue={props.Variant.salePrice} />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formStock">
                <Form.Label>Số lượng</Form.Label>
                <Form.Control type="text" placeholder="Nhập Số lượng" onChange={(e) => setStock(e.target.value)} defaultValue={props.Variant.stock} />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Đơn vị tính</Form.Label>
                <Form.Control
                  defaultValue={props.Variant.calUnit}
                  placeholder="Nhập Đơn Vị"
                  onChange={(e) => {
                    setUnit(e.target.value);
                  }}
                ></Form.Control>
              </Form.Group>
            </Row>{" "}
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formIsActive">
                <Form.Label>Mã SKU</Form.Label>
                <Form.Control defaultValue={props.Variant.skuCode} onChange={(e) => setSKUCode(e.target.value)}></Form.Control>
              </Form.Group>{" "}
              <Form.Group as={Col} controlId="formSubCategory">
                <Form.Label>Trạng Thái</Form.Label>
                <Form.Select defaultValue={props.Variant.isActive} onChange={(e) => setActive(e.target.value)}>
                  <option value="Draft">Chưa hoàn thành</option>
                  <option value="Published">Đang Bán</option>
                  <option value="NotAvailable">Ngừng Kinh Doanh</option>
                </Form.Select>
              </Form.Group>
            </Row>
            <Form.Group as={Col} controlId="formImage">
              <Form.Label>Hình ảnh sản phẩm</Form.Label>
              <Form.Control
                type="file"
                multiple
                placeholder=""
                onChange={(e) => {
                  handleImage(e);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGridPreviews">
              <div className="preview-image">
                {Array.isArray(props.Variant?.productImage) && props.Variant.productImage.length > 0 ? props.Variant.productImage.map((item, index) => <img key={index} src={item} width="100px" height="100px" alt={`Preview ${index}`} />) : null}
                {ImagePreviewURL.map((item, index) => {
                  return <img key={index} src={item} width="100px" height="100px" />;
                })}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              props.closeVariant();
            }}
          >
            Hủy
          </Button>
          <Button onClick={Add}>Thêm</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default UpdateVariant;
