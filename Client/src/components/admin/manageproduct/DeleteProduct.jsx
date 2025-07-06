import { Modal, Button } from "react-bootstrap";
import { deleteProduct } from "../../../services/GetAPI";
import { toast } from "react-toastify";
const DeleteProduct = (props) => {
  const handleDelete = async () => {
    try {
      await deleteProduct(props.InfoItem.productId);
      props.closeDelete();
      props.handleProductsList();
      toast.success("Xóa sản phẩm thành công ");
    } catch (e) {
      toast.error("Không thể xóa do ", e);
      throw e;
    }
  };
  return (
    <>
      <Modal size="x" show={props.isShowDelete} onHide={props.closeDelete}>
        <Modal.Header closeButton>Xóa sản phẩm</Modal.Header>
        <Modal.Body>
          <p>Bạn có chắc chắn muốn xóa sản phẩm không ?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleDelete}>Xác nhận</Button>
          <Button onClick={props.closeDelete}>Quay lại</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default DeleteProduct;
