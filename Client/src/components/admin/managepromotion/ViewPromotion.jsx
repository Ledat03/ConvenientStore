import { Modal, Button } from "react-bootstrap";

const ViewPromotion = (props) => {
  return (
    <>
      <Modal size="xl" show={props.isShowView} onHide={props.closeView}>
        <Modal.Header closeButton> Thông tin mã giảm giá </Modal.Header>
        <Modal.Body>
          <p>Mã giảm giá : {props.InfoItem.code}</p>
          <p>Tên giảm giá : {props.InfoItem.name}</p>
          <p>Loại giảm giá : {props.InfoItem.type}</p>
          <p>Phạm vi sử dụng : {props.InfoItem.scope}</p>
          <p>Mô tả : {props.InfoItem.description}</p>
          <p>Giá trị : {props.InfoItem.discountValue}</p>
          <p>Giảm tối đa : {props.InfoItem.maxDiscount}</p>
          <p>Giá trị đơn tối thiểu : {props.InfoItem.minOrderValue}</p>
          <p>Số lượt sử dụng tối đa : {props.InfoItem.usageLimit}</p>
          <p>Giới hạn sử dụng/người : {props.InfoItem.userUsageLimit}</p>
          <p>Ngày bắt đầu : {props.InfoItem.startDate}</p>
          <p>Ngày kết thúc : {props.InfoItem.endDate}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.closeView}>Cancel</Button>
        </Modal.Footer>
      </Modal>
      {}
    </>
  );
};
export default ViewPromotion;
