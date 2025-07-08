import { deleteImport } from "../../../services/GetAPI";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
const DeleteImport = (props) => {
  const handleDelete = async () => {
    try {
      await deleteImport(props.Import.importId);
      props.getListImport();
      toast.success("Xóa nhập hàng thành công!");
      props.close();
    } catch (e) {
      toast.error("Xóa nhập hàng thất bại!");
      console.error("Xảy ra lỗi khi xóa nhập hàng:", e);
      props.onDeleteError(e);
    }
  };
  return (
    <Modal show={props.isActive.deleteImport} onHide={props.close} centered>
      <Modal.Header closeButton>
        <Modal.Title>Xóa nhập hàng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Bạn có chắc chắn muốn xóa nhập hàng này không?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn-secondary" onClick={() => props.close()}>
          Hủy
        </Button>
        <Button className="btn-danger" onClick={handleDelete}>
          Xóa
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default DeleteImport;
