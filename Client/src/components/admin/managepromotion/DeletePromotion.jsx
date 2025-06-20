import { Modal, Button } from "react-bootstrap";
import { deleteProduct } from "../../../services/GetAPI";
import { toast } from "react-toastify";
const DeletePromotion = (props) => {
  const handleDelete = async () => {
    try {
      await deleteProduct(props.InfoItem.productId);
      props.closeDelete();
      props.handleProductsList();
      toast.success("Delete User successful ");
    } catch (e) {
      toast.error("Không thể xóa do ", e);
      throw e;
    }
  };
  return (
    <>
      <Modal size="x" show={props.isShowDelete} onHide={props.closeDelete}>
        <Modal.Header closeButton>Delete Product</Modal.Header>
        <Modal.Body>
          <p>Are you sure that you want to delete this product ?</p>
          <p>(Infomation of this product will no longer exist after deletion. )</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleDelete}>Confirm</Button>
          <Button onClick={props.closeDelete}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default DeletePromotion;
