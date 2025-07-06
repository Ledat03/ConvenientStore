import "./css/auth.scss";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/Winmart.svg";
import { Button, Form, FormGroup } from "react-bootstrap";
import { useState, useEffect } from "react";
import { forgotPassword, re_Password } from "../../services/AuthAPI";
const RePassword = () => {
  const location = useLocation();
  const Email = location.state?.email;
  const [CheckNumber, setNumber] = useState();
  const [ConfirmNumber, setConfirm] = useState(0);
  const [Password, setPassword] = useState();
  const [checkPassword, setCheckPassword] = useState();
  const [isTrue, setState] = useState(false);
  console.log(CheckNumber, " ", ConfirmNumber, " ", isTrue);
  const sendCode = async () => {
    const res = await forgotPassword(Email);
    setNumber(res.data);
  };
  const handleChangePassword = async () => {
    const res = await re_Password(Email, Password);
    console.log(res);
  };
  useEffect(() => {
    sendCode();
  }, []);

  return (
    <>
      {!isTrue ? (
        <div className="Authentication">
          <img className="Authentication__Image" />
          <div className="Authentication-Function">
            <div className="Authentication-Function__Handle">
              <Link to="/" className="Logo">
                <img src={Logo} alt="Winmart" />
              </Link>
              <h4>
                <strong>XÁC NHẬN TÀI KHOẢN</strong>
              </h4>
              <Form action="" className="Login-Form">
                <FormGroup>
                  <Form.Label>Nhập mã xác nhận</Form.Label>
                  <Form.Control
                    className="txt-SignIn"
                    type="text"
                    placeholder="Nhập mã xác nhận của bạn "
                    value={ConfirmNumber}
                    onChange={(e) => {
                      setConfirm(e.target.value);
                    }}
                  />
                </FormGroup>
                <Button
                  className="Auth-Button btn-danger"
                  onClick={() => {
                    if (CheckNumber === Number(ConfirmNumber)) {
                      setState(true);
                    }
                  }}
                >
                  Xác Nhận
                </Button>
              </Form>
            </div>
          </div>
        </div>
      ) : (
        <div className="Authentication">
          <img className="Authentication__Image" />
          <div className="Authentication-Function">
            <div className="Authentication-Function__Handle">
              <Link to="/" className="Logo">
                <img src={Logo} alt="Winmart" />
              </Link>
              <h4>
                <strong>Lấy lại mật khẩu</strong>
              </h4>
              <Form action="" className="Login-Form">
                <FormGroup>
                  <Form.Control
                    className="txt-SignIn"
                    type="text"
                    placeholder="Nhập mật khẩu mới"
                    value={Password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <Form.Control
                    className="txt-SignIn"
                    type="text"
                    placeholder="Nhập lại mật khẩu"
                    value={checkPassword}
                    onChange={(e) => {
                      setCheckPassword(e.target.value);
                    }}
                  />
                </FormGroup>
                <Button className="Auth-Button btn-danger" onClick={handleChangePassword}>
                  Xác Nhận
                </Button>
              </Form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default RePassword;
