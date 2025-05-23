import { Modal, Button } from "react-bootstrap";
// import { handleDeleteUser } from "../../../services/GetAPI";
import { toast } from "react-toastify";
const DeleteProduct = (props) => {
  //   const handleDelete = async () => {
  //     try {
  //       const DeleteInfo = await handleDeleteUser(props.InfoUser.id);
  //       props.closeDelete();
  //       toast.success("Delete User successful ");
  //       props.handleUsers();
  //     } catch (e) {
  //       toast.error("Không thể xóa do ", e);
  //       throw e;
  //     }
  //   };
  return (
    <>
      <Modal size="x" show={props.isShowDelete} onHide={props.closeDelete}>
        <Modal.Header closeButton>Delete User</Modal.Header>
        <Modal.Body>
          <p>Are you sure that you want to delete this user ?</p>
          <p>(Infomation of this user will no longer exist after deletion. )</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => console.log("Handle")}>Confirm</Button>
          <Button onClick={props.closeDelete}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default DeleteProduct;
