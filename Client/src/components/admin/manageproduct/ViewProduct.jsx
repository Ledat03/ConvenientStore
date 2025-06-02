import { Modal, Button } from "react-bootstrap";

const ViewProduct = (props) => {
  return (
    <>
      <Modal size="xl" show={props.isShowView} onHide={props.closeView}>
        <Modal.Header closeButton> Information Product </Modal.Header>
        <Modal.Body>
          <p>ID : {props.InfoItem.productId}</p>
          <p>Product Name : {props.InfoItem.productName}</p>
          <p>How to Use : {props.InfoItem.howToUse}</p>
          <p>Origin : {props.InfoItem.origin}</p>
          <p>Ingredient : {props.InfoItem.ingredient}</p>
          <p>Main Category : {props.InfoItem.category}</p>
          <p>Sub Category : {props.InfoItem.subCategory}</p>
          <p>Preserve : {props.InfoItem.preserve}</p>
          <p>Description : {props.InfoItem.productDescription}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.closeView}>Cancel</Button>
        </Modal.Footer>
      </Modal>
      {}
    </>
  );
};
export default ViewProduct;
