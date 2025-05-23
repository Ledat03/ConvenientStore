import { Modal, Button, Form, Col, Row } from "react-bootstrap";
const ViewProduct = (props) => {
  return (
    <>
      <Modal size="xl" show={props.isShowView} onHide={props.closeView}>
        <Modal.Header closeButton> Update User</Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Enter email" defaultValue={props.InfoUser.email} disabled />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" disabled />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control type="text" placeholder="First Name" defaultValue={props.InfoUser.firstName} disabled />
              </Form.Group>

              <Form.Group as={Col} controlId="formLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control type="text" placeholder="Last Name" defaultValue={props.InfoUser.lastName} disabled />
              </Form.Group>
            </Row>

            <Form.Group className="mb-3" controlId="formUserName">
              <Form.Label>UserName</Form.Label>
              <Form.Control placeholder="Enter User Name" defaultValue={props.InfoUser.username} disabled />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGridAddress1">
              <Form.Label>Address</Form.Label>
              <Form.Control placeholder="Enter Your Address" defaultValue={props.InfoUser.address} disabled />
            </Form.Group>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formPhoneNumber">
                <Form.Label>Phone</Form.Label>
                <Form.Control placeholder="Phone Number" defaultValue={props.InfoUser.phone} disabled />
              </Form.Group>
              <Form.Group as={Col} controlId="formRole">
                <Form.Label>Role</Form.Label>
                <Form.Select defaultValue={props.InfoUser.role} disabled>
                  <option>user</option>
                  <option>employee</option>
                  <option>admin</option>
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
export default ViewProduct;
