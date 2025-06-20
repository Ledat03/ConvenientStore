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
  const handleNewBrand = async () => {
    let newBrand = {
      brandName: NameBrand,
    };
    try {
      let response = await addBrand(newBrand);
      console.log(response);
      toast.success("Thêm mới nhãn hàng thành công");
      close();
      await props.handleBrands();
    } catch (e) {
      toast.error("Xảy ra lỗi khi thêm mới " + e.message);
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
              <Form.Control type="text" placeholder="Nhập tên hãng" value={NameBrand} onChange={(e) => setNameBrand(e.target.value)} />
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
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleNewBrand();
              clearInput();
            }}
          >
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default AddBrand;
