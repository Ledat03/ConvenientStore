import React, { useState } from "react";
import { Button, Form, FormGroup, FormLabel, Col, Row } from "react-bootstrap";
import "./css/auth.scss";
import { fetchLogin, fetchRegister } from "../../services/AuthAPI";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const Authentication = () => {
  const navigate = useNavigate();
  const [isLogin, setLogin] = useState(true);
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [Username, setUserName] = useState("");
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [RePassword, setRePassword] = useState("");
  const [Phone, setPhone] = useState("");
  const [Address, setAddress] = useState("");
  const ClearInput = () => {
    setEmail(""), setPassword(""), setUserName(""), setFirstName(""), setLastName(""), setRePassword(""), setAddress(""), setPhone("");
  };
  const handleLogin = async () => {
    let user = {
      username: Email,
      password: Password,
    };
    try {
      const response = await fetchLogin(user);
      if (response.status == 200) {
        console.log(response.data.data);
        localStorage.setItem("accessToken", response.data.data.accessToken);
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
        if (response.data.data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      toast.error("Không thể đăng nhập !");
      throw error;
    }
  };
  return (
    <div className="Authentication">
      <img className="Authentication__Image" />
      <div className="Authentication-Function">
        <div className="Authentication-Function__Handle">
          <h4>
            <strong>{isLogin ? "ĐĂNG NHẬP" : "ĐĂNG KÍ"}</strong>
          </h4>
          <div className="Auth-Option">
            <Button
              className={`Auth-Option__Login ${isLogin ? "active" : ""} btn-danger`}
              onClick={() => {
                setLogin(true);
              }}
            >
              <strong>Đăng Nhập</strong>
            </Button>
            <Button
              className={`Auth-Option__Register ${!isLogin ? "active" : ""} btn-danger`}
              onClick={() => {
                setLogin(false);
              }}
            >
              <strong>Đăng Kí</strong>
            </Button>
          </div>
        </div>
        {isLogin ? (
          <Form action="" className="Login-Form">
            <FormGroup>
              <Form.Control className="txt-SignIn" type="text" placeholder="Nhập email của bạn " value={Email} onChange={(e) => setEmail(e.target.value)} />
              <Form.Control className="txt-SignIn" type="password" placeholder="Nhập mật khẩu" value={Password} onChange={(e) => setPassword(e.target.value)} />
            </FormGroup>
            <FormGroup className="SignIn-Option">
              <FormGroup className="SignIn-Option__RememberMe">
                <Form.Check type="checkbox" />
                <FormLabel>Nhớ tài khoản </FormLabel>
              </FormGroup>
              <a href="">Quên Mật Khẩu ?</a>
            </FormGroup>
            <Button className="Auth-Button btn-danger" onClick={handleLogin}>
              Đăng Nhập
            </Button>
          </Form>
        ) : (
          <Form action="" className="Register-Form">
            <Row>
              {" "}
              <FormGroup as={Col}>
                <Form.Label className="Label-Register">Họ</Form.Label>
                <Form.Control className="txt-Register" type="text" placeholder="Họ" />
              </FormGroup>
              <FormGroup as={Col}>
                <Form.Label className="Label-Register">Tên</Form.Label>
                <Form.Control className="txt-Register" type="text" placeholder="Tên" />
              </FormGroup>
            </Row>
            <FormGroup>
              <Form.Label className="Label-Register">Tên Tài Khoản</Form.Label>
              <Form.Control className="txt-Register" type="text" placeholder="Nhập tên tài khoản" />
            </FormGroup>
            <FormGroup>
              <Form.Label className="Label-Register">Email</Form.Label>
              <Form.Control className="txt-Register" type="text" placeholder="Nhập Email" />
            </FormGroup>
            <FormGroup>
              <Form.Label className="Label-Register">Mật Khẩu</Form.Label>
              <Form.Control className="txt-Register" type="text" placeholder="Nhập Mật Khẩu" />
            </FormGroup>
            <FormGroup>
              <Form.Label className="Label-Register">Nhập Lại Mật Khẩu</Form.Label>
              <Form.Control className="txt-Register" type="text" placeholder="Nhập lại mật khẩu" />
            </FormGroup>
            <Row>
              {" "}
              <FormGroup as={Col}>
                <Form.Label className="Label-Register">Số Điện Thoại</Form.Label>
                <Form.Control className="txt-Register" type="text" placeholder="Nhập số điện thoại" />
              </FormGroup>
              <FormGroup as={Col}>
                <Form.Label className="Label-Register">Địa chỉ</Form.Label>
                <Form.Control className="txt-Register" type="text" placeholder="Nhập địa chỉ" />
              </FormGroup>
            </Row>
            <Button className={`Auth-Button btn-danger`} href="/">
              Đăng Kí
            </Button>
          </Form>
        )}
      </div>
    </div>
  );
};

export default Authentication;
