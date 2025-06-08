import { toast } from "react-toastify";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { handleListSubCate, addNewProduct } from "../../../services/GetAPI";
const AddProduct = (props) => {
  const [isShow, setShow] = useState(false);
  const close = () => setShow(false);
  const open = () => setShow(true);
  const [GetCategory, setGetCategory] = useState("Sữa Tươi");
  const [ProductName, setProductName] = useState("");
  const [ProductDescription, setProductDescription] = useState("");
  const [Origin, setOrigin] = useState("");
  const [Ingredient, setIngredient] = useState("");
  const [HowToUse, setHowToUse] = useState("");
  const [Preserve, setPreserve] = useState("");
  const [Brand, setBrand] = useState("");
  const [SKU, setSKU] = useState("");
  const [IsActive, setActive] = useState("true");
  const [Status, setStatus] = useState("Draft");
  const [SubCategory, setSubCategory] = useState([]);
  const [Image, setImage] = useState(null);
  const [ImageURL, setImageURL] = useState(null);
  const clearInput = () => {
    setProductName("");
    setProductDescription("");
    setOrigin("");
    setIngredient("");
    setHowToUse("");
    setPreserve("");
    setGetCategory("Sữa Tươi");
    setStatus("Draft");
    setActive("true");
    setBrand("");
    setSKU("");
    setImage(null);
    setImageURL("");
  };
  useEffect(() => {
    getListSubCate();
  }, []);
  const getListSubCate = async () => {
    const dataSubCate = await handleListSubCate();
    setSubCategory(dataSubCate.data.data);
  };
  const handleImage = (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        setImage(file);
        setImageURL(URL.createObjectURL(file));
      }
    } catch (error) {
      throw error;
    }
  };
  const handleAddProduct = async () => {
    const formData = new FormData();
    formData.append("productName", ProductName);
    formData.append("productDescription", ProductDescription);
    formData.append("origin", Origin);
    formData.append("ingredient", Ingredient);
    formData.append("howToUse", HowToUse);
    formData.append("preserve", Preserve);
    formData.append("subCategory", GetCategory);
    formData.append("brand", Brand);
    formData.append("sku", SKU);
    formData.append("isActive", IsActive);
    formData.append("status", Status);
    if (Image) {
      formData.append("image", Image);
    }
    try {
      await addNewProduct(formData);
      toast.success("Product Information Successful Added");
      close();
      props.handleProductsList();
      clearInput();
    } catch (error) {
      toast.error("Fail");
    }
  };
  console.log(GetCategory);
  return (
    <>
      <Button
        className="btn add-btn"
        onClick={() => {
          open();
        }}
      >
        Thêm sản phẩm
      </Button>
      <Modal size="xl" show={isShow} onHide={close}>
        <Modal.Header closeButton> Thêm Sản Phẩm</Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridProductName">
                <Form.Label>Tên Sản Phẩm</Form.Label>
                <Form.Control type="text" placeholder="Tên Sản Phẩm" value={ProductName} onChange={(e) => setProductName(e.target.value)} />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridOrigin">
                <Form.Label>Xuất Xứ</Form.Label>
                <Form.Control type="text" placeholder="Xuất Xứ" value={Origin} onChange={(e) => setOrigin(e.target.value)} />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formHowToUse">
                <Form.Label>Cách Sử Dụng</Form.Label>
                <Form.Control type="text" placeholder="Cách Sử Dụng" value={HowToUse} onChange={(e) => setHowToUse(e.target.value)} />
              </Form.Group>

              <Form.Group as={Col} controlId="formPreserve">
                <Form.Label>Bảo Quản</Form.Label>
                <Form.Control type="text" placeholder="Bảo Quản" value={Preserve} onChange={(e) => setPreserve(e.target.value)} />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} className="mb-3" controlId="formIngredient">
                <Form.Label>Dinh Dưỡng</Form.Label>
                <Form.Control type="text" placeholder="Dinh Dưỡng" value={Ingredient} onChange={(e) => setIngredient(e.target.value)} />
              </Form.Group>
              <Form.Group as={Col} controlId="formSubCategory">
                <Form.Label>Loại Sản Phẩm</Form.Label>
                <Form.Select value={GetCategory} onChange={(e) => setGetCategory(e.target.value)}>
                  {SubCategory.map((item) => {
                    return <option key={item.id}>{item.subCategoryName}</option>;
                  })}
                </Form.Select>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} className="mb-3" controlId="formIngredient">
                <Form.Label>Mã SKU</Form.Label>
                <Form.Control type="text" placeholder="Nhập Mã" value={SKU} onChange={(e) => setSKU(e.target.value)} />
              </Form.Group>
              <Form.Group as={Col} controlId="formSubCategory">
                <Form.Label>Hãng Sản Phẩm</Form.Label>
                <Form.Control value={Brand} onChange={(e) => setBrand(e.target.value)}></Form.Control>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formSubCategory">
                <Form.Label>Trạng Thái</Form.Label>
                <Form.Select value={Status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="Draft">Chưa hoàn thành</option>
                  <option value="Published">Đang Bán</option>
                  <option value="NotAvailable">Ngừng Kinh Doanh</option>
                </Form.Select>
              </Form.Group>
              <Form.Group as={Col} controlId="formIsActive">
                <Form.Label>Trạng thái Hoạt Động</Form.Label>
                <Form.Select value={IsActive} onChange={(e) => setActive(e.target.value)}>
                  <option value="true">Hiển thị</option>
                  <option value="false">Ẩn</option>
                </Form.Select>
              </Form.Group>
            </Row>
            <Form.Group className="mb-3" controlId="formDescription">
              <Form.Label>Mô Tả Sản Phẩm</Form.Label>
              <Form.Control as="textarea" rows="4" placeholder="Enter Description" value={ProductDescription} onChange={(e) => setProductDescription(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGridProductImage">
              <Form.Label>Hình Ảnh Minh Họa</Form.Label>
              <Form.Control type="file" rows="4" placeholder="Enter Description" onChange={(e) => handleImage(e)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGridPreviews">
              <div className="preview-image">
                <img key={1} src={ImageURL} width="300px" height="300px" />;
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={close}>Hủy</Button>
          <Button onClick={handleAddProduct}>Thêm</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default AddProduct;
