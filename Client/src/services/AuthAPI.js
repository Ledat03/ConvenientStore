import APIsCustomize from "../utils/APIsCustomize";

const fetchLogin = async (user) => await APIsCustomize.post("api/check/login", user, { headers: { "Content-Type": "application/json" } });

const fetchRegister = async (newUser) => await APIsCustomize.post("api/check/signup", newUser, { headers: { "Content-Type": "application/json" } });

const fetchLogOut = async (id) => await APIsCustomize.post("api/check/logout",null,{ params: { id: id }, headers: { "Content-Type": "application/json" } });
const forgotPassword = async (email) => await APIsCustomize.post(`api/check/forgot?gmail=${email}`,null, { headers: { "Content-Type": "application/json" } });
const verifyRegister = async (email) => await APIsCustomize.post(`api/check/register-number?gmail=${email}`,null, { headers: { "Content-Type": "application/json" } });
const checkOtpReset = async (email,code) => await APIsCustomize.post(`/api/check/verify/forgot?gmail=${email}&code=${code}`, { headers: { "Content-Type": "application/json" } })
const resendOtp = async (email,type) => await APIsCustomize.post(`/api/check/renew-otp?gmail=${email}&type=${type}`, { headers: { "Content-Type": "application/json" } });
const checkOtpRegister = async (email,code) => await APIsCustomize.post(`/api/check/verify/register?gmail=${email}&code=${code}`, { headers: { "Content-Type": "application/json" } });
const re_Password = async (email, password) => await APIsCustomize.put(`/api/check/update-password`,{email:email,password:password}, { headers: { "Content-Type": "application/json" } });
const re_Pay = async (id) => await APIsCustomize.post(`order/Re_Pay?id=${id}`);
const chatHandleRequest = async (message) => await APIsCustomize.post("/api/chatbot/message",message, {headers: {
      "Content-Type": "text/plain; charset=UTF-8"}})
export {chatHandleRequest, fetchLogin, fetchRegister, fetchLogOut, forgotPassword, re_Password, re_Pay,checkOtpReset,checkOtpRegister,resendOtp,verifyRegister };
