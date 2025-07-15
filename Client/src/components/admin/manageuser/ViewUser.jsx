import { Modal, Button, Form, Col, Row } from "react-bootstrap";
const ViewUser = (props) => {
  return (
    <>
      <Modal size="xl" show={props.isShowView} onHide={props.closeView}>
        <Modal.Header closeButton> Thông tin người dùng</Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Enter email" defaultValue={props.InfoUser.email} disabled />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Mật Khẩu</Form.Label>
                <Form.Control type="password" placeholder="Password" disabled />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formFirstName">
                <Form.Label>Họ</Form.Label>
                <Form.Control type="text" placeholder="First Name" defaultValue={props.InfoUser.firstName} disabled />
              </Form.Group>

              <Form.Group as={Col} controlId="formLastName">
                <Form.Label>Tên</Form.Label>
                <Form.Control type="text" placeholder="Last Name" defaultValue={props.InfoUser.lastName} disabled />
              </Form.Group>
            </Row>

            <Form.Group className="mb-3" controlId="formUserName">
              <Form.Label>Tên người dùng</Form.Label>
              <Form.Control placeholder="Enter User Name" defaultValue={props.InfoUser.username} disabled />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGridAddress1">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control placeholder="Enter Your Address" defaultValue={props.InfoUser.address} disabled />
            </Form.Group>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formPhoneNumber">
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control placeholder="Phone Number" defaultValue={props.InfoUser.phone} disabled />
              </Form.Group>
              <Form.Group as={Col} controlId="formRole">
                <Form.Label>Vai trò</Form.Label>
                <Form.Select defaultValue={props.InfoUser.role} disabled>
                  <option value="user">Người dùng</option>
                  <option value="employee">Nhân viên</option>
                  <option value="admin">Quản trị viên</option>
                </Form.Select>
              </Form.Group>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.closeView}>Cancel</Button>
        </Modal.Footer>
      </Modal>
      {}
    </>
  );
};
export default ViewUser;
