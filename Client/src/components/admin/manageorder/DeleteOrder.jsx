import { Modal, Button } from "react-bootstrap";
import { deleteOrder } from "../../../services/GetAPI";
const DeleteOrder = ({ isActive, close, Order, reload }) => {
  const handleDelete = async () => {
    try {
      await deleteOrder(Order.orderId);
      close();
      reload();
      toast.success("Xóa đơn hàng thành công !");
    } catch (e) {
      toast.error("Không thể xóa do ", e);
      throw e;
    }
  };
  console.log(Order);
  return (
    <>
      <Modal
        size="x"
        show={isActive}
        onHide={() => {
          close();
        }}
      >
        <Modal.Header closeButton>Xóa đơn hàng</Modal.Header>
        <Modal.Body>
          <p>Bạn có chắc chắn muốn xóa đơn hàng này hay không ?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleDelete}>Xác nhận</Button>
          <Button
            onClick={() => {
              close();
            }}
          >
            Quay lại
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteOrder;
