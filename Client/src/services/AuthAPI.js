import APIsCustomize from "../utils/APIsCustomize";

const fetchLogin = async (user) => await APIsCustomize.post("api/check/login", user, { headers: { "Content-Type": "application/json" } });

const fetchRegister = async (newUser) => await APIsCustomize.post("api/check/signup", newUser, { headers: { "Content-Type": "application/json" } });

const fetchLogOut = async () => await APIsCustomize.get("api/check/logout");
export { fetchLogin, fetchRegister, fetchLogOut };
