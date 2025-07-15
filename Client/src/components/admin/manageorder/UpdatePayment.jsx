import { useEffect, useState } from "react";
import { Modal, Form, Row, Col, Button } from "react-bootstrap";
import _ from "lodash";
import { updatePayment } from "../../../services/GetAPI";
const UpdatePayment = (props) => {
  const [Payment, setPayment] = useState({
    paymentId: 0,
    paymentMethod: "",
    paymentAmount: "",
    paymentDate: "",
    transactionId: "",
    paymentStatus: "",
  });
  useEffect(() => {
    if (!_.isEmpty(props.Order)) {
      setPayment({
        paymentId: props.Order.payment.paymentId,
        paymentMethod: props.Order.payment.paymentMethod,
        paymentAmount: props.Order.payment.paymentAmount,
        paymentDate: props.Order.payment.paymentDate,
        transactionId: props.Order.payment.transactionId,
        paymentStatus: props.Order.payment.paymentStatus,
      });
    }
  }, [props.Order]);
  const putPayment = async () => {
    const res = await updatePayment(Payment);
    getListOrder();
    console.log(res);
  };
  return (
    <>
      <Modal size="xl" show={props.isActive.UpdatePayment} onHide={props.close}>
        <Modal.Header closeButton>Trạng Thái Thanh Toán</Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Form.Group as={Col}>
                <Form.Label>Thời Gian Thanh Toán</Form.Label>
                <Form.Control
                  defaultValue={props.Order?.payment.paymentDate ? new Date(props.Order?.payment.paymentDate).toISOString().slice(0, 16) : ""}
                  onChange={(e) => {
                    setPayment({ ...Payment, paymentDate: e.target.value });
                  }}
                  type="datetime-local"
                />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col}>
                <Form.Label>Mã Giao Dịch</Form.Label>
                <Form.Control
                  defaultValue={props.Order?.payment.transactionId}
                  onChange={(e) => {
                    setPayment({ ...Payment, transactionId: e.target.value });
                  }}
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Tổng Tiền Cần Thanh Toán</Form.Label>
                <Form.Control
                  defaultValue={props.Order?.payment.paymentAmount}
                  onChange={(e) => {
                    setPayment({ ...Payment, paymentAmount: e.target.value });
                  }}
                />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col}>
                <Form.Label>Trạng Thái Thanh Toán</Form.Label>
                <Form.Select
                  defaultValue={props.Order?.payment.paymentStatus}
                  onChange={(e) => {
                    setPayment({ ...Payment, paymentStatus: e.target.value });
                  }}
                >
                  <option value="PENDING">Đang chờ thanh toán</option>
                  <option value="SUCCESS">Thanh Toán Thành Công</option>
                  <option value="RETURNED">Hoàn Tiền</option>
                  <option value="FAILED">Lỗi Giao Dịch</option>
                </Form.Select>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Phương Thức Thanh Toán</Form.Label>
                <Form.Select
                  defaultValue={props.Order?.payment.paymentMethod}
                  onChange={(e) => {
                    setPayment({ ...Payment, paymentMethod: e.target.value });
                  }}
                >
                  <option value="COD">Thanh Toán Khi Nhận Hàng</option>
                  <option value="E_WALLET">Thanh Toán Trực Tuyến</option>
                </Form.Select>
              </Form.Group>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.close}>Hủy</Button>
          <Button onClick={putPayment}>Cập Nhật</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UpdatePayment;
