import { toast } from "react-toastify";
import { updateBrand } from "../../../services/GetAPI";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import _ from "lodash";
const UpdateBrand = (props) => {
  const [Brand, setBrand] = useState("");
  useEffect(() => {
    if (!_.isEmpty(props.InfoBrand)) {
      setBrand(props.InfoBrand.brandName);
    }
  }, [props.InfoUser]);
  const handleUpdate = async () => {
    let newBrand = {
      brandId: props.InfoBrand.brandId,
      brandName: Brand,
    };
    try {
      let response = await updateBrand(newBrand);
      console.log(response);
      toast.success("Sửa Nhãn Hàng Thành Công");
      props.closeUpdate();
      await props.handleBrands();
    } catch (e) {
      toast.error("Không thể sửa vì " + e.message);
      throw e;
    }
  };
  return (
    <>
      <Modal size="xl" show={props.isShowUpdate} onHide={props.closeUpdate}>
        <Modal.Header closeButton> Cập nhật Nhãn Hàng</Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Nhập tên nhãn hàng</Form.Label>
              <Form.Control type="text" placeholder="Nhập Tên nhãn hàng" onChange={(e) => setBrand(e.target.value)} defaultValue={props.InfoBrand.brandName} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.closeUpdate}>Quay lại</Button>
          <Button onClick={handleUpdate}>Cập nhật</Button>
        </Modal.Footer>
      </Modal>
      {}
    </>
  );
};
export default UpdateBrand;
