import APIsCustomize from "../utils/APIsCustomize";

const fetchLogin = async (user) => await APIsCustomize.post("api/check/login", user, { headers: { "Content-Type": "application/json" } });

const fetchRegister = async (newUser) => await APIsCustomize.post("api/check/signup", newUser, { headers: { "Content-Type": "application/json" } });

const fetchLogOut = async () => await APIsCustomize.get("api/check/logout");
const forgotPassword = async (email) => await APIsCustomize.post("api/check/forgot", email, { headers: { "Content-Type": "application/json" } });
const re_Password = async (email, password) => await APIsCustomize.put(`user/re-password?email=${email}&password=${password}`, { headers: { "Content-Type": "application/json" } });
export { fetchLogin, fetchRegister, fetchLogOut, forgotPassword, re_Password };
