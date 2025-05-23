import { toast } from "react-toastify";
import { createNewUser } from "../../../services/GetAPI";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import { useState } from "react";
const CreateUser = (props) => {
  const [isShow, setShow] = useState(false);
  const close = () => setShow(false);
  const open = () => setShow(true);
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [UserName, setUserName] = useState("");
  const [Phone, setPhone] = useState("");
  const [Address, setAddress] = useState("");
  const [Role, setRole] = useState("user");
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  };
  const handleNewUser = async () => {
    const RegexEmail = validateEmail(Email);
    if (!RegexEmail) {
      toast.error("Invalid Email");
      return;
    }
    try {
      let response = await createNewUser(Email, Password, FirstName, LastName, UserName, Phone, Address, Role);
      if (response.statusCode < 400) {
        toast.success("Add new user successful");
        close();
        await props.handleUsers();
      }
    } catch (e) {
      toast.error("Failed to create user because " + e.message);
    }
  };
  const clearInput = () => {
    setEmail("");
    setAddress("");
    setFirstName("");
    setLastName("");
    setPassword("");
    setPhone("");
    setUserName("");
  };
  return (
    <>
      <Button
        className="btn add-btn"
        onClick={() => {
          open();
        }}
      >
        Thêm mới người dùng
      </Button>
      <Modal size="xl" show={isShow} onHide={close}>
        <Modal.Header closeButton> Add New User</Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Enter email" value={Email} onChange={(e) => setEmail(e.target.value)} />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" value={Password} onChange={(e) => setPassword(e.target.value)} />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control type="text" placeholder="First Name" value={FirstName} onChange={(e) => setFirstName(e.target.value)} />
              </Form.Group>

              <Form.Group as={Col} controlId="formLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control type="text" placeholder="Last Name" value={LastName} onChange={(e) => setLastName(e.target.value)} />
              </Form.Group>
            </Row>

            <Form.Group className="mb-3" controlId="formUserName">
              <Form.Label>UserName</Form.Label>
              <Form.Control placeholder="Enter User Name" value={UserName} onChange={(e) => setUserName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGridAddress1">
              <Form.Label>Address</Form.Label>
              <Form.Control placeholder="Enter Your Address" value={Address} onChange={(e) => setAddress(e.target.value)} />
            </Form.Group>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formPhoneNumber">
                <Form.Label>Phone</Form.Label>
                <Form.Control placeholder="Phone Number" value={Phone} onChange={(e) => setPhone(e.target.value)} />
              </Form.Group>
              <Form.Group as={Col} controlId="formRole">
                <Form.Label>Role</Form.Label>
                <Form.Select value={Role} onChange={(e) => setRole(e.target.value)}>
                  <option>User</option>
                  <option>Employee</option>
                  <option>Admin</option>
                </Form.Select>
              </Form.Group>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={close}>Cancel</Button>
          <Button
            onClick={() => {
              handleNewUser();
              clearInput();
            }}
          >
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default CreateUser;
