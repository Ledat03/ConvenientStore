import { useEffect, useState } from "react";
import { Modal, Form, Row, Col, Button } from "react-bootstrap";
import _ from "lodash";
import { updateDelivery } from "../../../services/GetAPI";
const UpdateDelivery = (props) => {
  const [Delivery, setDelivery] = useState({
    deliveryId: 0,
    receiverName: "",
    receiverPhone: "",
    deliveryStatus: "",
    deliveryDate: "",
    deliveredTime: "",
    deliveryMethod: "ship",
    trackingNumber: "",
    deliveryFee: "",
    deliveryAddress: "",
  });
  useEffect(() => {
    console.log("useEffect");
    if (!_.isEmpty(props.Order)) {
      setDelivery({
        deliveryId: props.Order.delivery.deliveryId,
        receiverName: props.Order.delivery.receiverName,
        receiverPhone: props.Order.delivery.receiverPhone,
        deliveryStatus: props.Order.delivery.deliveryStatus,
        deliveryDate: props.Order.delivery.deliveryDate,
        deliveredTime: props.Order.delivery.deliveredTime,
        deliveryMethod: props.Order.delivery.deliveryMethod,
        trackingNumber: props.Order.delivery.trackingNumber,
        deliveryFee: props.Order.delivery.deliveryFee,
        deliveryAddress: props.Order.delivery.deliveryAddress,
      });
    }
  }, [props.Order, props.isActive.UpdateDelivery]);
  console.log(Delivery);
  const putDelivery = async () => {
    const res = await updateDelivery(Delivery);
    console.log(res);
    props.getListOrder();
    props.close();
  };
  return (
    <>
      <Modal size="xl" show={props.isActive.UpdateDelivery} onHide={props.close}>
        <Modal.Header closeButton>Cập Nhật Giao Hàng</Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Form.Group as={Col}>
                <Form.Label>Tên Người Nhận</Form.Label>
                <Form.Control
                  value={Delivery.receiverName}
                  onChange={(e) => {
                    setDelivery({ ...Delivery, receiverName: e.target.value });
                  }}
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Số Điện Thoại</Form.Label>
                <Form.Control
                  value={Delivery.receiverPhone}
                  onChange={(e) => {
                    setDelivery({ ...Delivery, receiverPhone: e.target.value });
                  }}
                />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col}>
                <Form.Label>Thời Gian Giao Hàng</Form.Label>
                <Form.Control
                  value={Delivery.deliveryDate ? Delivery.deliveryDate : ""}
                  onChange={(e) => {
                    setDelivery({ ...Delivery, deliveryDate: e.target.value });
                  }}
                  type="datetime-local"
                />
                {console.log(Delivery.deliveryDate)}
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Thời Gian Nhận Hàng</Form.Label>
                <Form.Control
                  value={Delivery.deliveredTime ? new Date(props.Order.delivery.deliveredTime).toISOString().slice(0, 16) : ""}
                  onChange={(e) => {
                    setDelivery({ ...Delivery, deliveredTime: e.target.value });
                  }}
                  type="datetime-local"
                />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col}>
                <Form.Label>Mã Theo Dõi</Form.Label>
                <Form.Control
                  value={Delivery.trackingNumber}
                  onChange={(e) => {
                    setDelivery({ ...Delivery, trackingNumber: e.target.value });
                  }}
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Phí Giao Hàng</Form.Label>
                <Form.Control
                  value={Delivery.deliveryFee}
                  onChange={(e) => {
                    setDelivery({ ...Delivery, deliveryFee: e.target.value });
                  }}
                />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col}>
                <Form.Label>Trạng Thái Đơn Hàng</Form.Label>
                <Form.Select
                  value={Delivery.deliveryStatus}
                  onChange={(e) => {
                    setDelivery({ ...Delivery, deliveryStatus: e.target.value });
                  }}
                >
                  <option value="PENDING">Đang chờ giao hàng</option>
                  <option value="SHIPPED">Đang giao hàng</option>
                  <option value="DELIVERED">Đã giao hàng</option>
                  <option value="RETURNED">Hoàn hàng</option>
                  <option value="FAILED">Lỗi giao hàng</option>
                  <option value="CANCELLED">Hàng đã được hoàn lại</option>
                </Form.Select>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Phương Thức Giao Hàng</Form.Label>
                <Form.Select
                  value={Delivery.deliveryMethod}
                  onChange={(e) => {
                    setDelivery({ ...Delivery, deliveryMethod: e.target.value });
                  }}
                >
                  <option value="ship">Giao Hàng Tận Nơi</option>
                  <option value="pickup">Nhận Tại Cửa Hàng</option>
                </Form.Select>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col}>
                <Form.Label>Địa Chỉ Nhận Hàng</Form.Label>
                <Form.Control
                  value={Delivery.deliveryAddress}
                  onChange={(e) => {
                    setDelivery({ ...Delivery, deliveryAddress: e.target.value });
                  }}
                />
              </Form.Group>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.close}>Hủy</Button>
          <Button onClick={putDelivery}>Cập Nhật</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UpdateDelivery;
