import { toast } from "react-toastify";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import _ from "lodash";
import { AddNewVariant } from "../../../../services/GetAPI";
const AddVariant = (props) => {
  const [Price, setPrice] = useState("0");
  const [SalePrice, setSalePrice] = useState("0");
  const [Stock, setStock] = useState("0");
  const [Image, setImage] = useState([]);
  const [Unit, setUnit] = useState("");
  const [SKUCode, setSKUCode] = useState("");
  const [IsActive, setActive] = useState("true");
  const [ImagePreviewURL, setImagePreviewURL] = useState([]);
  const [Loading, setLoading] = useState(false);
  const ClearInput = () => {
    setPrice("0");
    setSalePrice("0");
    setStock("0");
    setImage([]);
    setUnit("");
    setSKUCode("");
    setActive("true");
    setImagePreviewURL([]);
  };
  const Add = async () => {
    const formData = new FormData();
    formData.append("productId", props.InfoItem.productId);
    formData.append("price", Price);
    formData.append("salePrice", SalePrice);
    formData.append("stock", Stock);
    formData.append("calUnit", Unit);
    formData.append("skuCode", SKUCode);
    formData.append("isActive", IsActive);
    Image.forEach((item) => {
      formData.append(`productImage`, item);
    });
    try {
      setLoading(true);
      console.log(formData.entries());
      await AddNewVariant(formData);
      toast.success("Thêm mới thành công");
      props.getVariants(props.InfoItem.productId);
      props.closeVariant();
      ClearInput();
      setLoading(false);
    } catch (e) {
      toast.error("có lỗi xảy ra", e);
      setLoading(false);
    }
  };
  const handleImage = (e) => {
    const files = Array.from(e.target.files);
    setImage(files);
    const previewImage = files.map((image) => URL.createObjectURL(image));
    setImagePreviewURL(previewImage);
    console.log(previewImage);
    console.log(Image);
  };

  return (
    <>
      <Modal size="xl" show={props.isShowVariant} onHide={props.closeVariant}>
        <Modal.Header closeButton> Thêm thông tin sản phẩm </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Tên sản phẩm</Form.Label>
              <Form.Label>{props.InfoItem.productName}</Form.Label>
            </Form.Group>
            {/* <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridPrice">
                <Form.Label>Giá</Form.Label>
                <Form.Control type="text" placeholder="Nhập Giá Sản Phẩm" value={Price} onChange={(e) => setPrice(e.target.value)} />
              </Form.Group>
              <Form.Group as={Col} controlId="formSalePrice">
                <Form.Label>Giá Khuyến mãi</Form.Label>
                <Form.Control type="text" placeholder="Nhập Giá Khuyến mãi" value={SalePrice} onChange={(e) => setSalePrice(e.target.value)} />
              </Form.Group>
            </Row> */}
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formStock">
                <Form.Label>Số lượng</Form.Label>
                <Form.Control type="text" placeholder="Số lượng sẽ được thêm khi nhập hàng" value={Stock} onChange={(e) => setStock(e.target.value)} disabled />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Đơn vị tính</Form.Label>
                <Form.Control
                  value={Unit}
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
                <Form.Control value={SKUCode} onChange={(e) => setSKUCode(e.target.value)}></Form.Control>
              </Form.Group>{" "}
              <Form.Group as={Col} controlId="formSubCategory">
                <Form.Label>Trạng Thái</Form.Label>
                <Form.Select value={IsActive} onChange={(e) => setActive(e.target.value)}>
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
                placeholder=" "
                onChange={(e) => {
                  handleImage(e);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGridPreviews">
              <div className="preview-image">
                {ImagePreviewURL.map((item, index) => {
                  return <img key={index} src={item} width="100px" height="100px" />;
                })}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.closeVariant}>Hủy</Button>
          <Button onClick={Add} disabled={Loading}>
            Thêm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default AddVariant;
