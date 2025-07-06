import { Modal, Button } from "react-bootstrap";

const ViewProduct = (props) => {
  return (
    <>
      <Modal size="xl" show={props.isShowView} onHide={props.closeView}>
        <Modal.Header closeButton> Thông tin sản phẩm </Modal.Header>
        <Modal.Body>
          <p>ID : {props.InfoItem.productId}</p>
          <p>Tên sản phẩm : {props.InfoItem.productName}</p>
          <p>Cách sử dụng : {props.InfoItem.howToUse}</p>
          <p>Xuất xứ : {props.InfoItem.origin}</p>
          <p>Thành phần : {props.InfoItem.ingredient}</p>
          <p>Danh mục chính : {props.InfoItem.category}</p>
          <p>Danh mục nhánh : {props.InfoItem.subCategory}</p>
          <p>Bảo quản : {props.InfoItem.preserve}</p>
          <p>Mô tả : {props.InfoItem.productDescription}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.closeView}>Quay lại</Button>
        </Modal.Footer>
      </Modal>
      {}
    </>
  );
};
export default ViewProduct;
