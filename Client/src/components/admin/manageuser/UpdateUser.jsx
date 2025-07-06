import { toast } from "react-toastify";
import { handleUpdate } from "../../../services/GetAPI";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import _ from "lodash";
const UpdateUser = (props) => {
  const [Id, setId] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [UserName, setUserName] = useState("");
  const [Phone, setPhone] = useState("");
  const [Address, setAddress] = useState("");
  const [Role, setRole] = useState("user");
  useEffect(() => {
    console.log("this is useEffect ");
    if (!_.isEmpty(props.InfoUser)) {
      setId(props.InfoUser.id);
      setEmail(props.InfoUser.email);
      setFirstName(props.InfoUser.firstName);
      setLastName(props.InfoUser.lastName);
      setUserName(props.InfoUser.username);
      setAddress(props.InfoUser.address);
      setPhone(props.InfoUser.phone);
      setRole(props.InfoUser.role);
    }
  }, [props.InfoUser]);
  const handleUpdateUser = async () => {
    try {
      let response = await handleUpdate(Id, Email, Password, FirstName, LastName, UserName, Phone, Address, Role);
      console.log(response);
      if (response.statusCode < 400) {
        toast.success("Change information successful");
        props.closeUpdate();
        await props.handleUsers();
      }
    } catch (e) {
      toast.error("Failed to update  user because " + e.message);
      throw e;
    }
  };
  return (
    <>
      <Modal size="xl" show={props.isShowUpdate} onHide={props.closeUpdate}>
        <Modal.Header closeButton>Cập nhật người dùng</Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} defaultValue={props.InfoUser.email} disabled />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Mật Khẩu</Form.Label>
                <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} disabled />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formFirstName">
                <Form.Label>Họ</Form.Label>
                <Form.Control type="text" placeholder="First Name" onChange={(e) => setFirstName(e.target.value)} defaultValue={props.InfoUser.firstName} />
              </Form.Group>

              <Form.Group as={Col} controlId="formLastName">
                <Form.Label>Tên</Form.Label>
                <Form.Control type="text" placeholder="Last Name" onChange={(e) => setLastName(e.target.value)} defaultValue={props.InfoUser.lastName} />
              </Form.Group>
            </Row>

            <Form.Group className="mb-3" controlId="formUserName">
              <Form.Label>Tên Người Dùng</Form.Label>
              <Form.Control placeholder="Enter User Name" onChange={(e) => setUserName(e.target.value)} defaultValue={props.InfoUser.username} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGridAddress1">
              <Form.Label>Địa Chỉ</Form.Label>
              <Form.Control placeholder="Enter Your Address" onChange={(e) => setAddress(e.target.value)} defaultValue={props.InfoUser.address} />
            </Form.Group>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formPhoneNumber">
                <Form.Label>Số Điện Thoại</Form.Label>
                <Form.Control placeholder="Phone Number" onChange={(e) => setPhone(e.target.value)} defaultValue={props.InfoUser.phone} />
              </Form.Group>
              <Form.Group as={Col} controlId="formRole">
                <Form.Label>Quyền Hạn</Form.Label>
                <Form.Select onChange={(e) => setRole(e.target.value)} defaultValue={props.InfoUser.role}>
                  <option value="user">Người dùng</option>
                  <option value="employee">Nhân viên</option>
                  <option value="admin">Quản trị viên</option>
                </Form.Select>
              </Form.Group>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.closeUpdate}>Cancel</Button>
          <Button onClick={handleUpdateUser}>Update</Button>
        </Modal.Footer>
      </Modal>
      {}
    </>
  );
};
export default UpdateUser;
