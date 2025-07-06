import { toast } from "react-toastify";
import { createNewUser } from "../../../services/GetAPI";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
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
  const [Validate, setValidate] = useState({});
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  };
  const handleNewUser = async () => {
    const error = {};
    let user = {
      email: Email,
      passwordHash: Password,
      firstName: FirstName,
      lastName: LastName,
      username: UserName,
      phone: Phone,
      address: Address,
      role: "user",
    };
    const RegexEmail = validateEmail(user.email);
    const checkValidate = () => {
      if (!RegexEmail) error.email = "Email không đúng định dạng";
      if (!user.email.trim()) error.email = "Email không được để trống";
      if (!user.passwordHash.trim()) error.password = "Mật khẩu không được để trống";
      if (!user.firstName.trim()) error.firstName = "Trường này không được để trống";
      if (!user.lastName.trim()) error.lastName = "Trường này không được để trống";
      if (!user.username.trim()) error.username = "Trường không được để trống";
      if (!user.phone.trim()) error.phoneNumber = "Số điện thoại không được trống";
      if (!user.address.trim()) error.address = "Địa chỉ không được để trống";
      setValidate(error);
      return Object.keys(error).length === 0;
    };
    if (!checkValidate()) return;
    try {
      let response = await createNewUser(user);
      if (response.statusCode < 400) {
        toast.success("Thêm người dùng mới thành công !");
        close();
        await props.handleUsers();
      }
    } catch (e) {
      toast.error("Không thể thêm người dùng vì " + e.message);
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
        className="add-btn"
        onClick={() => {
          open();
        }}
      >
        <FaPlus className="i i-add-user" />
      </Button>
      <Modal size="xl" show={isShow} onHide={close}>
        <Modal.Header closeButton> Thêm Người Dùng</Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Enter email" value={Email} onChange={(e) => setEmail(e.target.value)} isInvalid={!!Validate.email} />
                <Form.Control.Feedback type="invalid">{Validate.email}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Mật Khẩu</Form.Label>
                <Form.Control type="password" placeholder="Password" value={Password} onChange={(e) => setPassword(e.target.value)} isInvalid={!!Validate.password} />
                <Form.Control.Feedback type="invalid">{Validate.password}</Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formFirstName">
                <Form.Label>Họ</Form.Label>
                <Form.Control type="text" placeholder="First Name" value={FirstName} onChange={(e) => setFirstName(e.target.value)} isInvalid={!!Validate.firstName} />
                <Form.Control.Feedback type="invalid">{Validate.firstName}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} controlId="formLastName">
                <Form.Label>Tên</Form.Label>
                <Form.Control type="text" placeholder="Last Name" value={LastName} onChange={(e) => setLastName(e.target.value)} isInvalid={Validate.lastName} />
                <Form.Control.Feedback type="invalid">{Validate.lastName}</Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Form.Group className="mb-3" controlId="formUserName">
              <Form.Label>Tên Người Dùng</Form.Label>
              <Form.Control placeholder="Enter User Name" value={UserName} onChange={(e) => setUserName(e.target.value)} isInvalid={!!Validate.username} />
              <Form.Control.Feedback type="invalid">{Validate.username}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGridAddress1">
              <Form.Label>Địa Chỉ</Form.Label>
              <Form.Control placeholder="Enter Your Address" value={Address} onChange={(e) => setAddress(e.target.value)} isInvalid={Validate.address} />
              <Form.Control.Feedback type="invalid">{Validate.address}</Form.Control.Feedback>
            </Form.Group>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formPhoneNumber">
                <Form.Label>Số Điện Thoại</Form.Label>
                <Form.Control placeholder="Phone Number" value={Phone} onChange={(e) => setPhone(e.target.value)} isInvalid={!!Validate.phoneNumber} />
                <Form.Control.Feedback type="invalid">{Validate.phoneNumber}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} controlId="formRole">
                <Form.Label>Phân Quyền</Form.Label>
                <Form.Select value={Role} onChange={(e) => setRole(e.target.value)}>
                  <option value="user">Người dùng</option>
                  <option value="employee">Nhân Viên</option>
                  <option value="admin">Quản trị viên</option>
                </Form.Select>
              </Form.Group>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={close}>Quay Lại</Button>
          <Button
            onClick={() => {
              handleNewUser();
              clearInput();
            }}
          >
            Thêm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default CreateUser;
