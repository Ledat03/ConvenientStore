import { toast } from "react-toastify";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import { useState, useRef } from "react";
import _ from "lodash";
import { IoMdClose } from "react-icons/io";
import { GoFileSymlinkFile } from "react-icons/go";
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
  const addFilesTrigger = useRef(null);
  const buttonTrigger = () => {
    addFilesTrigger.current?.click();
  };
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
  console.log(Image);
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
    if (files.length == 0) return;
    setImage((prev) => [...prev, ...files]);
    const previewImage = files.map((image) => URL.createObjectURL(image));
    setImagePreviewURL((prev) => [...prev, ...previewImage]);
    console.log(previewImage);
    console.log(Image);
    e.target.value = null;
  };
  const deleteImage = (index) => {
    URL.revokeObjectURL(ImagePreviewURL[index]);
    const newListImage = ImagePreviewURL.filter((_, i) => i !== index);
    setImagePreviewURL(newListImage);
    const newImage = Image.filter((_, i) => i !== index);
    setImage(newImage);
  };
  return (
    <>
      <Modal
        className="admin-crud-modal"
        size="xl"
        show={props.isShowVariant}
        onHide={props.closeVariant}
      >
        <Modal.Header closeButton> Thêm thông tin sản phẩm </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              if (!Loading) {
                Add();
              }
            }}
          >
            <Form.Group>
              <Form.Label>Tên sản phẩm</Form.Label>
              <Form.Label>{props.InfoItem.productName}</Form.Label>
            </Form.Group>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formStock">
                <Form.Label>Số lượng</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Số lượng sẽ được thêm khi nhập hàng"
                  value={Stock}
                  onChange={(e) => setStock(e.target.value)}
                  disabled
                />
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
                <Form.Control
                  value={SKUCode}
                  onChange={(e) => setSKUCode(e.target.value)}
                ></Form.Control>
              </Form.Group>{" "}
              <Form.Group as={Col} controlId="formSubCategory">
                <Form.Label>Trạng Thái</Form.Label>
                <Form.Select
                  value={IsActive}
                  onChange={(e) => setActive(e.target.value)}
                >
                  <option value="Draft">Chưa hoàn thành</option>
                  <option value="Published">Đang Bán</option>
                  <option value="NotAvailable">Ngừng Kinh Doanh</option>
                </Form.Select>
              </Form.Group>
            </Row>
            <Form.Group as={Col} controlId="formImage">
              <Form.Label>
                Hình ảnh sản phẩm{" "}
                <GoFileSymlinkFile onClick={() => buttonTrigger()} size={20} />
              </Form.Label>

              <div>
                <Form.Control
                  type="file"
                  multiple
                  ref={addFilesTrigger}
                  placeholder=" "
                  hidden
                  onChange={(e) => {
                    handleImage(e);
                  }}
                />
                {Image.length == 0 && (
                  <div className="image-box" onClick={() => buttonTrigger()}>
                    <GoFileSymlinkFile size={40} />
                    <h3>Ấn để chọn ảnh sản phẩm</h3>
                    <p>JPG, PNG, WEBP (có thể chọn nhiều)</p>
                  </div>
                )}
              </div>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGridPreviews">
              <div className="preview-image">
                {ImagePreviewURL.map((item, index) => {
                  return (
                    <div className="display-img" key={index}>
                      <div onClick={() => deleteImage(index)}>
                        <IoMdClose />
                      </div>
                      <img src={item} width="100px" height="100px" />
                    </div>
                  );
                })}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.closeVariant}>Hủy</Button>
          <Button type="submit" onClick={Add} disabled={Loading}>
            Thêm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default AddVariant;
