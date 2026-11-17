import { useState, useEffect } from "react";
import { Button, Form, FormGroup, Col, Row } from "react-bootstrap";
import "./css/auth.scss";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import {
  fetchLogin,
  verifyRegister,
  forgotPassword,
} from "../../services/AuthAPI";
import { Bounce, ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const AuthVisual = () => (
  <div className="Authentication__Visual" aria-hidden="true">
    <div className="Authentication__VisualContent">
      <Link to="/" className="auth-brand">
        <span className="auth-brand__mark">B</span>
        <span>BASE Market</span>
      </Link>
      <div className="auth-visual-copy">
        <span className="auth-eyebrow">Mua sắm tiện lợi mỗi ngày</span>
        <h2>Mọi nhu cầu của bạn, trong một điểm đến.</h2>
        <p>
          Đăng nhập để theo dõi đơn hàng, lưu sản phẩm yêu thích và nhận ưu
          đãi dành riêng cho thành viên.
        </p>
      </div>
      <div className="auth-benefits">
        <span>Giao hàng nhanh</span>
        <span>Thanh toán an toàn</span>
        <span>Đổi trả dễ dàng</span>
      </div>
    </div>
  </div>
);

const Authentication = () => {
  const navigate = useNavigate();
  const [FuncState, setFuncState] = useState({
    isLogin: true,
    isForgot: false,
    isLoading: false,
  });
  const location = useLocation();
  const isSuccess = location.state?.success;
  const isRegisterSuccess = location.state?.registerSuccess;
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [Username, setUserName] = useState("");
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [RePassword, setRePassword] = useState("");
  const [Phone, setPhone] = useState("");
  const [Address, setAddress] = useState("");
  const [Validate, setValidate] = useState({});
  const ClearInput = () => {
    (setEmail(""),
      setPassword(""),
      setUserName(""),
      setFirstName(""),
      setLastName(""),
      setRePassword(""),
      setAddress(""),
      setPhone(""));
  };
  useEffect(() => {
    if (isSuccess) toast.success("Đổi mật khẩu thành công !");
    if (isRegisterSuccess) toast.success("Đăng kí tài khoản thành công !");
  }, [isSuccess, isRegisterSuccess]);
  const handleLogin = async (e) => {
    setFuncState((prev) => ({ ...prev, isLoading: true }));
    e.preventDefault();
    let user = {
      username: Email,
      password: Password,
    };
    try {
      const response = await fetchLogin(user);
      if (response.status == 200) {
        localStorage.setItem(
          "accessToken",
          response.data.responseData.accessToken,
        );
        const user = {
          id: response.data.responseData.id,
          name: response.data.responseData.name,
          role: response.data.responseData.role,
          username: response.data.responseData.username,
        };
        localStorage.setItem("user", JSON.stringify(user));
        if (user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      toast.error("Email hoặc mật khẩu không chính xác !");
      throw error;
    } finally {
      setFuncState((prev) => ({ ...prev, isLoading: false }));
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
    if (!user.username.trim())
      error.username = "Tên người dùng không được để trống";
    if (!user.email.trim()) error.email = "Email không được để trống";
    if (!user.passwordHash.trim())
      error.password = "Mật khẩu không được để trống";
    if (!user.firstName.trim()) error.firstName = "Họ không được để trống";
    if (!user.lastName.trim()) error.lastName = "Tên không được để trống";
    if (!user.phone.trim())
      error.phoneNumber = "Số điện thoại không được để trống";
    if (!user.address.trim()) error.address = "Địa chỉ không được để trống";
    setValidate(error);
    return Object.keys(error).length === 0;
  };
  const handleSignUp = async () => {
    if (!checkValidate()) return;
    if (Password !== RePassword) {
      toast.error("Mật khẩu nhập lại không khớp");
      return;
    }
    try {
      await verifyRegister(Email);
      localStorage.setItem("userInfor", JSON.stringify(user));
      navigate("/re-password", {
        state: {
          email: Email,
          verifyType: "EMAIL_VERIFICATION",
          isSend: true,
        },
      });
    } catch (error) {
      if (error.response?.status === 409)
        toast.error("Email đã được sử dụng !");
      if (
        error.response?.status === 400 &&
        error.response.data &&
        typeof error.response.data === "object" &&
        !Array.isArray(error.response.data)
      ) {
        Object.values(error.response.data).forEach((message) => {
          toast.error(`Lỗi : ${message}`);
        });
      }
      return;
    } finally {
      setFuncState((prev) => ({ ...prev, isLoading: false }));
    }
  };
  const handleCheckEmail = async () => {
    try {
      const response = await forgotPassword(Email);
      if (response.data.statusCode === 201)
        navigate("/re-password", {
          state: { email: Email, verifyType: "FORGOT_PASSWORD", isSend: true },
        });
      setFuncState((prev) => ({ ...prev, isLoading: false }));
    } catch (e) {
      toast.error("Email không tồn tại !");
      console.log(e);
    } finally {
      setFuncState((prev) => ({ ...prev, isLoading: false }));
    }
  };
  const VerifyEmail = () => {
    if (FuncState.isForgot) {
      return (
        <div
          key="forgot-password"
          className="Authentication auth-panel-transition auth-panel-transition--forward"
        >
          <AuthVisual />
          <div className="Authentication-Function">
            <div className="Authentication-Function__Handle">
              <Link to="/" className="Logo">
                <h1>Base</h1>
              </Link>
              <h4>
                <IoChevronBackCircleOutline
                  className="back-icon"
                  onClick={() =>
                    setFuncState((prev) => ({ ...prev, isForgot: false }))
                  }
                />
                <strong>QUÊN MẬT KHẨU</strong>
              </h4>
              <Form action="" className="Login-Form">
                <FormGroup>
                  <Form.Label>Nhập Email của bạn</Form.Label>
                  <Form.Control
                    className="txt-SignIn"
                    type="text"
                    placeholder="Nhập email của bạn "
                    value={Email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormGroup>
                <Form.Label>Email phải là email đã đăng ký trước đó</Form.Label>
                <Button
                  disabled={FuncState.isLoading}
                  className="Auth-Button "
                  onClick={() => {
                    setFuncState((prev) => ({ ...prev, isLoading: true }));
                    handleCheckEmail();
                  }}
                >
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
      {!FuncState.isForgot ? (
        <div
          key="authentication"
          className="Authentication auth-panel-transition auth-panel-transition--backward"
        >
          <AuthVisual />
          <div className="Authentication-Function">
            <div className="Authentication-Function__Handle">
              <Link to="/" className="Logo">
                <h1>Base</h1>
              </Link>

              <h4 key={FuncState.isLogin ? "login-title" : "register-title"} className="auth-title-transition">
                <strong>{FuncState.isLogin ? "Đăng nhập" : "Đăng kí"}</strong>
              </h4>
              <div className="Auth-Option">
                <Button
                  className={`Auth-Option__Login ${FuncState.isLogin ? "active" : ""} `}
                  onClick={() => {
                    ClearInput();
                    setFuncState((prev) => ({ ...prev, isLogin: true }));
                  }}
                >
                  <strong>Đăng nhập</strong>
                </Button>
                <Button
                  className={`Auth-Option__Register ${!FuncState.isLogin ? "active" : ""} `}
                  onClick={() => {
                    ClearInput();
                    setFuncState((prev) => ({ ...prev, isLogin: false }));
                  }}
                >
                  <strong>Đăng kí</strong>
                </Button>
              </div>
            </div>
            {FuncState.isLogin ? (
              <Form
                key="login-form"
                action=""
                className="Login-Form auth-form-transition auth-form-transition--backward"
                onSubmit={handleLogin}
              >
                <FormGroup>
                  <Form.Label>Email hoặc tên tài khoản</Form.Label>
                  <Form.Control
                    className="txt-SignIn"
                    type="text"
                    placeholder="Nhập email hoặc tên tài khoản"
                    value={Email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Form.Label>Mật khẩu</Form.Label>
                  <Form.Control
                    className="txt-SignIn"
                    type="password"
                    placeholder="Nhập mật khẩu"
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormGroup>
                <FormGroup className="SignIn-Option">
                  <span
                    onClick={() => {
                      setFuncState((prev) => ({ ...prev, isForgot: true }));
                    }}
                  >
                    Bạn quên mật khẩu ?
                  </span>
                </FormGroup>
                <Button
                  className="Auth-Button "
                  type="submit"
                  disabled={FuncState.isLoading}
                >
                  Đăng nhập
                </Button>
              </Form>
            ) : (
              <Form
                key="register-form"
                action=""
                className="Register-Form auth-form-transition auth-form-transition--forward"
              >
                <Row>
                  {" "}
                  <FormGroup as={Col}>
                    <Form.Label className="Label-Register">Họ</Form.Label>
                    <Form.Control
                      className="txt-Register"
                      name="firstName"
                      type="text"
                      placeholder="Họ"
                      value={FirstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      isInvalid={!!Validate.firstName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {Validate.firstName}
                    </Form.Control.Feedback>
                  </FormGroup>
                  <FormGroup as={Col}>
                    <Form.Label className="Label-Register">Tên</Form.Label>
                    <Form.Control
                      className="txt-Register"
                      name="lastName"
                      type="text"
                      placeholder="Tên"
                      value={LastName}
                      onChange={(e) => setLastName(e.target.value)}
                      isInvalid={!!Validate.lastName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {Validate.firstName}
                    </Form.Control.Feedback>
                  </FormGroup>
                </Row>
                <FormGroup>
                  <Form.Label className="Label-Register">
                    Tên Tài Khoản
                  </Form.Label>
                  <Form.Control
                    className="txt-Register"
                    name="username"
                    type="text"
                    placeholder="Nhập tên tài khoản"
                    value={Username}
                    onChange={(e) => setUserName(e.target.value)}
                    isInvalid={!!Validate.username}
                  />
                  <Form.Control.Feedback type="invalid">
                    {Validate.username}
                  </Form.Control.Feedback>
                </FormGroup>
                <FormGroup>
                  <Form.Label className="Label-Register">Email</Form.Label>
                  <Form.Control
                    className="txt-Register"
                    type="text"
                    name="email"
                    placeholder="Nhập Email"
                    value={Email}
                    onChange={(e) => setEmail(e.target.value)}
                    isInvalid={!!Validate.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {Validate.email}
                  </Form.Control.Feedback>
                </FormGroup>
                <FormGroup>
                  <Form.Label className="Label-Register">Mật Khẩu</Form.Label>
                  <Form.Control
                    className="txt-Register"
                    name="password"
                    type="password"
                    placeholder="Nhập Mật Khẩu"
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)}
                    isInvalid={!!Validate.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {Validate.password}
                  </Form.Control.Feedback>
                </FormGroup>
                <FormGroup>
                  <Form.Label className="Label-Register">
                    Nhập Lại Mật Khẩu
                  </Form.Label>
                  <Form.Control
                    className="txt-Register"
                    type="password"
                    name="rePassword"
                    placeholder="Nhập lại mật khẩu"
                    value={RePassword}
                    onChange={(e) => setRePassword(e.target.value)}
                    isInvalid={!!Validate.rePassword}
                  />
                  <Form.Control.Feedback type="invalid">
                    {Validate.rePassword}
                  </Form.Control.Feedback>
                </FormGroup>
                <Row>
                  {" "}
                  <FormGroup as={Col}>
                    <Form.Label className="Label-Register">
                      Số Điện Thoại
                    </Form.Label>
                    <Form.Control
                      className="txt-Register"
                      name="phoneNumber"
                      type="text"
                      placeholder="Nhập số điện thoại"
                      value={Phone}
                      onChange={(e) => setPhone(e.target.value)}
                      isInvalid={!!Validate.phoneNumber}
                    />
                    <Form.Control.Feedback type="invalid">
                      {Validate.phoneNumber}
                    </Form.Control.Feedback>
                  </FormGroup>
                  <FormGroup as={Col}>
                    <Form.Label className="Label-Register">Địa chỉ</Form.Label>
                    <Form.Control
                      className="txt-Register"
                      name="address"
                      type="text"
                      placeholder="Nhập địa chỉ"
                      value={Address}
                      onChange={(e) => setAddress(e.target.value)}
                      isInvalid={!!Validate.address}
                    />
                    <Form.Control.Feedback type="invalid">
                      {Validate.address}
                    </Form.Control.Feedback>
                  </FormGroup>
                </Row>
                <Button
                  className={`Auth-Button `}
                  onClick={async () => {
                    setFuncState((prev) => ({ ...prev, isLoading: true }));
                    await handleSignUp();
                  }}
                >
                  Đăng Kí
                </Button>
              </Form>
            )}
          </div>
        </div>
      ) : (
        VerifyEmail()
      )}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </>
  );
};

export default Authentication;
