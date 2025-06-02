import React, { use, useState } from "react";
import { Button, Form, FormGroup, FormLabel, Col, Row } from "react-bootstrap";
import "./css/auth.scss";
import { createNewUser } from "../../services/GetAPI";
const SignIn = () => {
  const [isLogin, setLogin] = useState(true);
  return (
    <div className="Authentication">
      <img className="Authentication__Image" />
      <div className="Authentication-Function">
        <div className="Authentication-Function__Handle">
          <h2>{isLogin ? "Đăng nhập" : "Đăng Kí"}</h2>
          <div className="Auth-Option">
            <Button className="Auth-Option__Login" onClick={() => setLogin(true)}>
              Đăng Nhập
            </Button>
            <Button className="Auth-Option__Register" onClick={() => setLogin(false)}>
              Đăng Kí
            </Button>
          </div>
        </div>
        {isLogin ? (
          <Form action="" className="Login-Form">
            <FormGroup>
              <Form.Control className="txt-SignIn" type="text" placeholder="Nhập email của bạn " />
              <Form.Control className="txt-SignIn" type="password" placeholder="Nhập mật khẩu" />
            </FormGroup>
            <FormGroup className="SignIn-Option">
              <FormGroup className="SignIn-Option__RememberMe">
                <Form.Check type="checkbox" />
                <FormLabel>Nhớ tài khoản </FormLabel>
              </FormGroup>
              <a href="">Quên Mật Khẩu ?</a>
            </FormGroup>
            <Button className="Auth-Button" href="/">
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
            <Button className="Auth-Button" href="/">
              Đăng Kí
            </Button>
          </Form>
        )}
      </div>
    </div>
  );
};

export default SignIn;
