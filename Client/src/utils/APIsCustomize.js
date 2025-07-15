import axios from "axios";
import { Cookies } from "react-cookie";
import { toast } from "react-toastify";

const APIsCustomize = axios.create({
  baseURL: "http://localhost:8080/",
  withCredentials: true,
});
const cookies = new Cookies();
APIsCustomize.interceptors.request.use(
  function (config) {
    const getToken = localStorage.getItem("accessToken");
    if (getToken) {
      config.headers["Authorization"] = `Bearer ${getToken}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

const handleRefreshToken = async () => {
  try {
    const response = await APIsCustomize.get("api/check/auth/refresh");
    const { accessToken } = response.data.data;
    console.log(accessToken);
    return accessToken;
  } catch (error) {
    await fetchLogOut();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    window.location.href = "/authenticate";
    toast.error("Phiên của bạn đã hết hạn !");
    return null;
  }
};

APIsCustomize.interceptors.response.use(
  (res) => {
    console.log("Response success:", res);
    return res;
  },
  async (error) => {
    console.log("Error occurred:", error);
    if (error.response.status === 401 && !error.config._retry) {
      error.config._retry = true;
      const Token = cookies.get("refreshToken");
      console.log(Token);
      if (!Token) {
        return Promise.reject(error);
      }
      try {
        const response = await APIsCustomize.get("api/check/auth/refresh", { params: { refreshToken: Token } });
        console.log(response);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        cookies.remove("refreshToken");
        window.location.href = "/authenticate";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default APIsCustomize;
