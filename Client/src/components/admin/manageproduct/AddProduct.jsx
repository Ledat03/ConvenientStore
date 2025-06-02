import { toast } from "react-toastify";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { handleListSubCate, addNewProduct } from "../../../services/GetAPI";
const AddProduct = (props) => {
  const [isShow, setShow] = useState(false);
  const close = () => setShow(false);
  const open = () => setShow(true);
  const [ProductName, setProductName] = useState("");
  const [ProductDescription, setProductDescription] = useState("");
  const [Origin, setOrigin] = useState("");
  const [Ingredient, setIngredient] = useState("");
  const [HowToUse, setHowToUse] = useState("");
  const [Preserve, setPreserve] = useState("");
  const [SubCategory, setSubCategory] = useState([]);
  const [GetCategory, setGetCategory] = useState("Sữa Tươi");
  const clearInput = () => {
    setProductName("");
    setProductDescription("");
    setOrigin("");
    setIngredient("");
    setHowToUse("");
    setPreserve("");
    setGetCategory("");
  };
  useEffect(() => {
    getListSubCate();
  }, []);
  const getListSubCate = async () => {
    const dataSubCate = await handleListSubCate();
    setSubCategory(dataSubCate.data.data);
  };
  const handleAddProduct = async () => {
    try {
      await addNewProduct(ProductName, ProductDescription, Origin, Ingredient, HowToUse, Preserve, GetCategory);
      toast.success("Product Information Successful Added");
      close();
      props.handleProductsList();
      clearInput();
    } catch (error) {
      toast.error("Fail");
    }
  };
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
        <Modal.Header closeButton> Add New Product</Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridProductName">
                <Form.Label>Product Name</Form.Label>
                <Form.Control type="text" placeholder="Enter Product name" value={ProductName} onChange={(e) => setProductName(e.target.value)} />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridOrigin">
                <Form.Label>Origin</Form.Label>
                <Form.Control type="text" placeholder="Origin" value={Origin} onChange={(e) => setOrigin(e.target.value)} />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formHowToUse">
                <Form.Label>How To Use</Form.Label>
                <Form.Control type="text" placeholder="" value={HowToUse} onChange={(e) => setHowToUse(e.target.value)} />
              </Form.Group>

              <Form.Group as={Col} controlId="formPreserve">
                <Form.Label>Preserve</Form.Label>
                <Form.Control type="text" placeholder="Last Name" value={Preserve} onChange={(e) => setPreserve(e.target.value)} />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} className="mb-3" controlId="formIngredient">
                <Form.Label>Ingredient</Form.Label>
                <Form.Control type="text" placeholder="Enter Ingredient" value={Ingredient} onChange={(e) => setIngredient(e.target.value)} />
              </Form.Group>
              <Form.Group as={Col} controlId="formSubCategory">
                <Form.Label>SubCategory</Form.Label>
                <Form.Select value={GetCategory} onChange={(e) => setGetCategory(e.target.value)}>
                  {SubCategory.map((item, index) => {
                    return <option key={item.id}>{item.subCategoryName}</option>;
                  })}
                </Form.Select>
              </Form.Group>
            </Row>
            <Form.Group className="mb-3" controlId="formGridProductDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows="4" placeholder="Enter Description" value={ProductDescription} onChange={(e) => setProductDescription(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={close}>Cancel</Button>
          <Button onClick={handleAddProduct}>Add</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default AddProduct;
