import { Modal, Button } from "react-bootstrap";
import { deleteProduct } from "../../../services/GetAPI";
import { toast } from "react-toastify";
const DeletePromotion = (props) => {
  const handleDelete = async () => {
    try {
      await deleteProduct(props.InfoItem.productId);
      props.closeDelete();
      props.handleProductsList();
      toast.success("Xóa mã giảm giá thành công !");
    } catch (e) {
      toast.error("Không thể xóa do ", e);
      throw e;
    }
  };
  return (
    <>
      <Modal size="x" show={props.isShowDelete} onHide={props.closeDelete}>
        <Modal.Header closeButton>Xóa mã giảm giá</Modal.Header>
        <Modal.Body>
          <p>Bạn có chắc chắn muốn xóa phiếu giảm giá này hay không</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleDelete}>Xác nhận</Button>
          <Button onClick={props.closeDelete}>Quay lại</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default DeletePromotion;
