import React, { useState } from "react";
import { Button, Form, FormGroup, Col, Row } from "react-bootstrap";
import "./css/auth.scss";
import { fetchLogin, fetchRegister } from "../../services/AuthAPI";
import Logo from "../../assets/Winmart.svg";
import { Bounce, ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
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
  const [Validate, setValidate] = useState({});
  const [ForgotState, setForgot] = useState(false);
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
      toast.error("Email hoặc mật khẩu không chính xác !");
      throw error;
    }
  };

  let user = {
    username: Username,
    email: Email,
    passwordHash: Password,
    firstName: FirstName,
    lastName: LastName,
    phone: Phone,
    role: "user",
    address: Address,
  };
  const checkValidate = () => {
    const error = {};
    if (!user.username.trim()) error.username = "Bạn cần nhập trường này";
    if (!user.email.trim()) error.email = "Email không được để trống";
    if (!user.passwordHash.trim()) error.password = "Bạn cần nhập trường này";
    if (!user.firstName.trim()) error.firstName = "Bạn cần nhập trường này";
    if (!user.lastName.trim()) error.lastName = "Bạn cần nhập trường này";
    if (!user.phone.trim()) error.phoneNumber = "Số điện thoại không được trống";
    if (!user.address.trim()) error.address = "Bạn cần nhập trường này";
    setValidate(error);
    return Object.keys(error).length === 0;
  };
  const handleSignUp = async () => {
    if (!checkValidate()) return;
    if (Password !== RePassword) {
      toast.error("Mật khẩu nhập lại không trùng khớp");
      return;
    }
    try {
      const res = await fetchRegister(user);
      if (res.status < 400) {
        toast.success("Đăng Kí Thành Công !");
        setLogin(true);
      }
    } catch (error) {
      toast.error("Đăng kí không thành công Email đã tồn tại");
    }
  };
  const handleCheckEmail = async () => {
    try {
      navigate("/re-password", { state: { email: Email } });
    } catch (e) {
      toast.error("Email không tồn tại !");
    }
  };
  const FogotPassword = () => {
    if (ForgotState) {
      return (
        <div className="Authentication">
          <img className="Authentication__Image" />
          <div className="Authentication-Function">
            <div className="Authentication-Function__Handle">
              <Link to="/" className="Logo">
                <img src={Logo} alt="Winmart" />
              </Link>
              <h4>
                <strong>QUÊN MẬT KHẨU</strong>
              </h4>
              <Form action="" className="Login-Form">
                <FormGroup>
                  <Form.Label>Nhập Email của bạn</Form.Label>
                  <Form.Control className="txt-SignIn" type="text" placeholder="Nhập email của bạn " value={Email} onChange={(e) => setEmail(e.target.value)} />
                </FormGroup>
                <Form.Label>Email phải là email đã đăng ký trước đó</Form.Label>
                <Button className="Auth-Button btn-danger" onClick={handleCheckEmail}>
                  Xác Nhận
                </Button>
              </Form>
            </div>
          </div>
        </div>
      );
    }
  };
  return (
    <>
      {!ForgotState ? (
        <div className="Authentication">
          <img className="Authentication__Image" />
          <div className="Authentication-Function">
            <div className="Authentication-Function__Handle">
              <Link to="/" className="Logo">
                <img src={Logo} alt="Winmart" />
              </Link>

              <h4>
                <strong>{isLogin ? "ĐĂNG NHẬP" : "ĐĂNG KÍ"}</strong>
              </h4>
              <div className="Auth-Option">
                <Button
                  className={`Auth-Option__Login ${isLogin ? "active" : ""} btn-danger`}
                  onClick={() => {
                    ClearInput();
                    setLogin(true);
                  }}
                >
                  <strong>Đăng Nhập</strong>
                </Button>
                <Button
                  className={`Auth-Option__Register ${!isLogin ? "active" : ""} btn-danger`}
                  onClick={() => {
                    ClearInput();
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
                  <span
                    onClick={() => {
                      setForgot(true);
                    }}
                  >
                    Quên Mật Khẩu ?
                  </span>
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
                    <Form.Control className="txt-Register" name="firstName" type="text" placeholder="Họ" value={FirstName} onChange={(e) => setFirstName(e.target.value)} isInvalid={!!Validate.firstName} />
                    <Form.Control.Feedback type="invalid">{Validate.firstName}</Form.Control.Feedback>
                  </FormGroup>
                  <FormGroup as={Col}>
                    <Form.Label className="Label-Register">Tên</Form.Label>
                    <Form.Control className="txt-Register" name="lastName" type="text" placeholder="Tên" value={LastName} onChange={(e) => setLastName(e.target.value)} isInvalid={!!Validate.lastName} />
                    <Form.Control.Feedback type="invalid">{Validate.firstName}</Form.Control.Feedback>
                  </FormGroup>
                </Row>
                <FormGroup>
                  <Form.Label className="Label-Register">Tên Tài Khoản</Form.Label>
                  <Form.Control className="txt-Register" name="username" type="text" placeholder="Nhập tên tài khoản" value={Username} onChange={(e) => setUserName(e.target.value)} isInvalid={!!Validate.username} />
                  <Form.Control.Feedback type="invalid">{Validate.username}</Form.Control.Feedback>
                </FormGroup>
                <FormGroup>
                  <Form.Label className="Label-Register">Email</Form.Label>
                  <Form.Control className="txt-Register" type="text" name="email" placeholder="Nhập Email" value={Email} onChange={(e) => setEmail(e.target.value)} isInvalid={!!Validate.email} />
                  <Form.Control.Feedback type="invalid">{Validate.email}</Form.Control.Feedback>
                </FormGroup>
                <FormGroup>
                  <Form.Label className="Label-Register">Mật Khẩu</Form.Label>
                  <Form.Control className="txt-Register" name="password" type="password" placeholder="Nhập Mật Khẩu" value={Password} onChange={(e) => setPassword(e.target.value)} isInvalid={!!Validate.password} />
                  <Form.Control.Feedback type="invalid">{Validate.password}</Form.Control.Feedback>
                </FormGroup>
                <FormGroup>
                  <Form.Label className="Label-Register">Nhập Lại Mật Khẩu</Form.Label>
                  <Form.Control className="txt-Register" type="password" name="rePassword" placeholder="Nhập lại mật khẩu" value={RePassword} onChange={(e) => setRePassword(e.target.value)} isInvalid={!!Validate.rePassword} />
                  <Form.Control.Feedback type="invalid">{Validate.rePassword}</Form.Control.Feedback>
                </FormGroup>
                <Row>
                  {" "}
                  <FormGroup as={Col}>
                    <Form.Label className="Label-Register">Số Điện Thoại</Form.Label>
                    <Form.Control className="txt-Register" name="phoneNumber" type="text" placeholder="Nhập số điện thoại" value={Phone} onChange={(e) => setPhone(e.target.value)} isInvalid={!!Validate.phoneNumber} />
                    <Form.Control.Feedback type="invalid">{Validate.phoneNumber}</Form.Control.Feedback>
                  </FormGroup>
                  <FormGroup as={Col}>
                    <Form.Label className="Label-Register">Địa chỉ</Form.Label>
                    <Form.Control className="txt-Register" name="address" type="text" placeholder="Nhập địa chỉ" value={Address} onChange={(e) => setAddress(e.target.value)} isInvalid={!!Validate.address} />
                    <Form.Control.Feedback type="invalid">{Validate.address}</Form.Control.Feedback>
                  </FormGroup>
                </Row>
                <Button className={`Auth-Button btn-danger`} onClick={handleSignUp}>
                  Đăng Kí
                </Button>
              </Form>
            )}
          </div>
          <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" transition={Bounce} />
        </div>
      ) : (
        FogotPassword()
      )}
    </>
  );
};

export default Authentication;
