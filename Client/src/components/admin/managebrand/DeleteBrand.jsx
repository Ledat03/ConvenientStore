import { Modal, Button } from "react-bootstrap";
import { deleteBrand } from "../../../services/GetAPI";
import { toast } from "react-toastify";
const DeleteBrand = (props) => {
  const handleDelete = async () => {
    try {
      await deleteBrand(props.InfoBrand.brandId);
      props.closeDelete();
      props.handleBrands();
      toast.success("Xóa Nhãn Hàng Thành Công ");
    } catch (e) {
      toast.error("Không thể xóa do ", e);
      throw e;
    }
  };
  return (
    <>
      <Modal size="x" show={props.isShowDelete} onHide={props.closeDelete}>
        <Modal.Header closeButton>Xóa Nhãn Hàng</Modal.Header>
        <Modal.Body>
          <p>Bạn có chắc muốn xóa nhãn hàng này hay không ?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleDelete}>Xác Nhận</Button>
          <Button onClick={props.closeDelete}>Đóng</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default DeleteBrand;
