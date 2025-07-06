import { toast } from "react-toastify";
import { addBrand, handleListSubCate } from "../../../services/GetAPI";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
const AddBrand = (props) => {
  const [isShow, setShow] = useState(false);
  const close = () => setShow(false);
  const open = () => setShow(true);
  const [NameBrand, setNameBrand] = useState("");
  const [Validate, setValidate] = useState({});
  const handleNewBrand = async () => {
    let newBrand = {
      brandName: NameBrand,
    };
    const checkValidate = () => {
      const error = {};
      if (!newBrand.brandName.trim()) error.brand = "Bạn cần nhập đầy đủ tên nhãn hàng !";
      setValidate(error);
      return Object.keys(error).length === 0;
    };
    if (!checkValidate()) return;
    try {
      let response = await addBrand(newBrand);
      console.log(response);
      if (response.status < 400) {
        toast.success("Thêm mới nhãn hàng thành công");
        close();
        await props.handleBrands();
      }
    } catch (e) {
      toast.error("Nhãn hàng này đã tồn tại !");
    }
  };
  const clearInput = () => {
    setNameBrand("");
  };
  return (
    <>
      <Button
        className="add-btn"
        onClick={() => {
          open();
        }}
      >
        <FaPlus className="i i-add-user" />
      </Button>
      <Modal size="xl" show={isShow} onHide={close}>
        <Modal.Header closeButton> Thêm Nhãn Hàng</Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formGridBrand">
              <Form.Label>Tên Nhãn Hàng</Form.Label>
              <Form.Control type="text" placeholder="Nhập tên hãng" value={NameBrand} onChange={(e) => setNameBrand(e.target.value)} isInvalid={!!Validate.brand} />
              <Form.Control.Feedback type="invalid">{Validate.brand}</Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              close();
              clearInput();
            }}
          >
            Quay lại
          </Button>
          <Button
            onClick={() => {
              handleNewBrand();
              clearInput();
            }}
          >
            Thêm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default AddBrand;
