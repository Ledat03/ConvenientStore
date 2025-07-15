import APIsCustomize from "../utils/APIsCustomize";

const fetchLogin = async (user) => await APIsCustomize.post("api/check/login", user, { headers: { "Content-Type": "application/json" } });

const fetchRegister = async (newUser) => await APIsCustomize.post("api/check/signup", newUser, { headers: { "Content-Type": "application/json" } });

const fetchLogOut = async () => await APIsCustomize.get("api/check/logout");
const forgotPassword = async (email) => await APIsCustomize.post("api/check/forgot", email, { headers: { "Content-Type": "application/json" } });
const re_Password = async (email, password) => await APIsCustomize.put(`user/re-password?email=${email}&password=${password}`, { headers: { "Content-Type": "application/json" } });
const re_Pay = async (id) => await APIsCustomize.post(`order/Re_Pay?id=${id}`);
export { fetchLogin, fetchRegister, fetchLogOut, forgotPassword, re_Password, re_Pay };
