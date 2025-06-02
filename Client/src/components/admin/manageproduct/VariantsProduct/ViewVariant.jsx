import { Modal, Button, Form, Col, Row } from "react-bootstrap";
const ViewVariant = (props) => {
  return (
    <>
      <Modal show={props.isShowVariant} onHide={props.closeVariant}>
        <Modal.Header closeButton>View Variant</Modal.Header>
      </Modal>
    </>
  );
};
export default ViewVariant;
