import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { deleteVariant } from "../../../../services/GetAPI";
const DeleteVariant = (props) => {
  const handleDelete = async (id) => {
    try {
      const deleteStatus = await deleteVariant(id);
      toast.success(deleteStatus.data);
      props.getVariants(props.InfoItem.productId);
      props.closeVariant();
    } catch (error) {
      toast.error("Xóa không thành công !");
      throw error;
    }
  };
  return (
    <>
      <Modal show={props.isShowVariant} onHide={props.closeVariant}>
        <Modal.Header closeButton>Xóa thông tin</Modal.Header>
        <Modal.Body>
          <h6>Bạn có chắc muốn xóa thông tin này hay không ?</h6>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => handleDelete(props.Variant.id)}>Đồng ý</Button>
          <Button onClick={props.closeVariant}>Hủy</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default DeleteVariant;
