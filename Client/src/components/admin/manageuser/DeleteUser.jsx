import { Modal, Button } from "react-bootstrap";
import { handleDeleteUser } from "../../../services/GetAPI";
import { toast } from "react-toastify";
const DeleteUser = (props) => {
  const handleDelete = async () => {
    try {
      await handleDeleteUser(props.InfoUser.id);
      props.closeDelete();
      toast.success("Xóa người dùng thành công ");
      props.handleUsers();
    } catch (e) {
      toast.error("Không thể xóa do ", e);
      throw e;
    }
  };
  return (
    <>
      <Modal size="x" show={props.isShowDelete} onHide={props.closeDelete}>
        <Modal.Header closeButton>Xóa người dùng</Modal.Header>
        <Modal.Body>
          <p>Bạn có chắc chắn muốn xóa người dùng này ?</p>
          <p>Các thông tin về người dùng này sẽ bị xóa hoàn toàn</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleDelete}>Xác nhận</Button>
          <Button onClick={props.closeDelete}>Quay lại</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default DeleteUser;
