import { toast } from "react-toastify";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { handleListSubCate, updateProduct } from "../../../services/GetAPI";
import _ from "lodash";
const UpdateProduct = (props) => {
  const [Id, setId] = useState("");
  const [ProductName, setProductName] = useState("");
  const [ProductDescription, setProductDescription] = useState("");
  const [Origin, setOrigin] = useState("");
  const [Ingredient, setIngredient] = useState("");
  const [HowToUse, setHowToUse] = useState("");
  const [Preserve, setPreserve] = useState("");
  const [SubCategory, setSubCategory] = useState([]);
  const [GetCategory, setGetCategory] = useState("Sữa Tươi");
  const [Brand, setBrand] = useState("");
  const [SKU, setSKU] = useState("");
  const [IsActive, setActive] = useState("true");
  const [Status, setStatus] = useState("Draft");
  const [Image, setImage] = useState(null);
  const [ImageURL, setImageURL] = useState(null);
  useEffect(() => {
    if (!_.isEmpty(props.InfoItem)) {
      setId(props.InfoItem.productId);
      setProductName(props.InfoItem.productName);
      setProductDescription(props.InfoItem.productDescription);
      setOrigin(props.InfoItem.origin);
      setIngredient(props.InfoItem.ingredient);
      setHowToUse(props.InfoItem.howToUse);
      setPreserve(props.InfoItem.preserve);
      setGetCategory(props.InfoItem.subCategory);
      setActive(props.InfoItem.isActive);
      setStatus(props.InfoItem.status);
      setBrand(props.InfoItem.brand);
      setSKU(props.InfoItem.sku);
    }
    getListSubCate();
  }, [props.InfoItem]);
  const getListSubCate = async () => {
    const dataSubCate = await handleListSubCate();
    setSubCategory(dataSubCate.data.data);
  };
  const updateInfoProduct = async () => {
    try {
      let Product = {
        productId: Id,
        productName: ProductName,
        productDescription: ProductDescription,
        origin: Origin,
        ingredient: Ingredient,
        howToUse: HowToUse,
        preserve: Preserve,
        subCategory: GetCategory,
        brand: Brand,
        sku: SKU,
        isActive: IsActive,
        status: Status,
      };
      await updateProduct(Product);
      toast.success("Product Information is Updated");
      props.handleProductsList();
      props.closeUpdate();
    } catch (error) {
      toast.error("Fail");
    }
  };
  return (
    <>
      <Modal size="xl" show={props.isShowUpdate} onHide={props.closeUpdate}>
        <Modal.Header closeButton> Update Product</Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridProductName">
                <Form.Label>Product Name</Form.Label>
                <Form.Control type="text" placeholder="Enter Product name" onChange={(e) => setProductName(e.target.value)} defaultValue={props.InfoItem.productName} />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridOrigin">
                <Form.Label>Origin</Form.Label>
                <Form.Control type="text" placeholder="Origin" onChange={(e) => setOrigin(e.target.value)} defaultValue={props.InfoItem.origin} />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formHowToUse">
                <Form.Label>How To Use</Form.Label>
                <Form.Control type="text" placeholder="" onChange={(e) => setHowToUse(e.target.value)} defaultValue={props.InfoItem.howToUse} />
              </Form.Group>

              <Form.Group as={Col} controlId="formPreserve">
                <Form.Label>Preserve</Form.Label>
                <Form.Control type="text" placeholder="Last Name" onChange={(e) => setPreserve(e.target.value)} defaultValue={props.InfoItem.preserve} />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} className="mb-3" controlId="formIngredient">
                <Form.Label>Ingredient</Form.Label>
                <Form.Control type="text" placeholder="Enter Ingredient" onChange={(e) => setIngredient(e.target.value)} defaultValue={props.InfoItem.ingredient} />
              </Form.Group>
              <Form.Group as={Col} controlId="formSubCategory">
                <Form.Label>SubCategory</Form.Label>
                <Form.Select
                  defaultValue={props.InfoItem.subCategory}
                  onChange={(e) => {
                    setGetCategory(e.target.value);
                  }}
                >
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
            <Form.Group className="mb-3" controlId="formGridProductDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control defaultValue={props.InfoItem.productDescription} as="textarea" rows="4" placeholder="Enter Description" onChange={(e) => setProductDescription(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.closeUpdate}>Cancel</Button>
          <Button onClick={updateInfoProduct}>Update</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default UpdateProduct;
