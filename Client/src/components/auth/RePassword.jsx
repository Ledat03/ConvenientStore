import "./css/auth.scss";
import { Link, useLocation } from "react-router-dom";
import { Button, Form, FormGroup } from "react-bootstrap";
import { useState } from "react";
import { Bounce, ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import {
  re_Password,
  checkOtpReset,
  checkOtpRegister,
  resendOtp,
  fetchRegister,
} from "../../services/AuthAPI";
import { useNavigate } from "react-router-dom";
import ResendOtpButton from "../common/ResendOtpButton";
import { useEffect } from "react";

const AuthVisual = () => (
  <div className="Authentication__Visual" aria-hidden="true">
    <div className="Authentication__VisualContent">
      <Link to="/" className="auth-brand">
        <span className="auth-brand__mark">B</span>
        <span>BASE Market</span>
      </Link>
      <div className="auth-visual-copy">
        <span className="auth-eyebrow">Bảo mật tài khoản</span>
        <h2>Xác thực nhanh chóng, mua sắm an tâm.</h2>
        <p>
          Chúng tôi bảo vệ thông tin của bạn trong từng bước đăng nhập và
          thanh toán.
        </p>
      </div>
      <div className="auth-benefits">
        <span>Xác thực bảo mật</span>
        <span>Dữ liệu riêng tư</span>
        <span>Hỗ trợ nhanh chóng</span>
      </div>
    </div>
  </div>
);

const RePassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const Email = location.state?.email;
  const VerifyType = location.state?.verifyType;
  const IsSend = location.state?.isSend ? location.state?.isSend : false;
  const [ConfirmNumber, setConfirm] = useState();
  const [Password, setPassword] = useState();
  const [checkPassword, setCheckPassword] = useState();
  const [isTrue, setState] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const handleChangePassword = async () => {
    try {
      setLoading(true);
      await re_Password(Email, Password);

      navigate("/authenticate", { state: { success: true } });
    } catch (error) {
      console.log(error);
      toast.error("Mật khẩu của bạn bị trùng với mật khẩu đã dùng trước đó");
    }
  };
  useEffect(() => {
    if (IsSend) toast.success("Mã xác nhận đã được gửi");
  }, [IsSend]);
  return (
    <>
      {isTrue && VerifyType === "FORGOT_PASSWORD" ? (
        <div
          key="new-password"
          className="Authentication auth-panel-transition auth-panel-transition--forward"
        >
          <AuthVisual />
          <div className="Authentication-Function">
            <div className="Authentication-Function__Handle">
              <Link to="/" className="Logo">
                <p>Base</p>
              </Link>
              <h4>
                <strong>Lấy lại mật khẩu</strong>
              </h4>
              <Form
                key="new-password-form"
                action=""
                className="Login-Form auth-form-transition auth-form-transition--forward"
              >
                <FormGroup>
                  <Form.Control
                    className="txt-SignIn"
                    type="password"
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
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    value={checkPassword}
                    onChange={(e) => {
                      setCheckPassword(e.target.value);
                    }}
                  />
                </FormGroup>
                <Button
                  disabled={isLoading}
                  className="Auth-Button"
                  onClick={async () => {
                    await handleChangePassword();
                    setLoading(false);
                  }}
                >
                  Xác Nhận
                </Button>
              </Form>
            </div>
          </div>
        </div>
      ) : (
        <div
          key="otp-verification"
          className="Authentication auth-panel-transition auth-panel-transition--backward"
        >
          <AuthVisual />
          <div className="Authentication-Function">
            <div className="Authentication-Function__Handle">
              <Link to="/" className="Logo">
                <h1>Base</h1>
              </Link>
              <h4>
                <strong>XÁC NHẬN TÀI KHOẢN</strong>
              </h4>
              <Form
                key="otp-form"
                action=""
                className="Login-Form auth-form-transition auth-form-transition--backward"
              >
                <FormGroup>
                  <Form.Label>Nhập mã xác nhận</Form.Label>
                  <div className="otp-input">
                    <Form.Control
                      className="txt-SignIn"
                      type="text"
                      placeholder="Nhập mã xác nhận của bạn "
                      value={ConfirmNumber}
                      onChange={(e) => {
                        setConfirm(e.target.value);
                      }}
                    />
                    <ResendOtpButton
                      onResend={async () => {
                        await resendOtp(Email, VerifyType);
                      }}
                      sendState={IsSend}
                    />
                  </div>
                </FormGroup>
                <Button
                  disabled={isLoading}
                  className="Auth-Button"
                  onClick={async () => {
                    try {
                      setLoading(true);
                      if (VerifyType === "FORGOT_PASSWORD") {
                        await checkOtpReset(Email, ConfirmNumber);
                        toast.success("Xác Thực Email Thành Công !");
                        setState(true);
                      }
                      if (VerifyType === "EMAIL_VERIFICATION") {
                        await checkOtpRegister(Email, ConfirmNumber);
                        const user = JSON.parse(
                          localStorage.getItem("userInfor"),
                        );
                        const res = await fetchRegister(user);
                        if (res.status === 200)
                          localStorage.removeItem("userInfor");
                        navigate("/authenticate", {
                          state: { registerSuccess: true },
                        });
                      }
                    } catch (error) {
                      if (error.status === 404)
                        toast.error("Mã xác nhận không chính xác");
                      if (error.status === 410)
                        toast.error(
                          "Mã của bạn đã hết hạn hoặc vô hiệu do nhập sai quá nhiều - Hãy yêu cầu mã xác thực khác",
                        );
                      console.log(error);
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  Xác Nhận
                </Button>
              </Form>
            </div>
          </div>
        </div>
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
export default RePassword;
