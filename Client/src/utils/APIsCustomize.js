import axios from "axios";
import { toast } from "react-toastify";

const APIsCustomize = axios.create({
  baseURL: "http://localhost:8080/",
});

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
    const response = await instance.get("/api/check/auth/refresh");
    const { accessToken } = response.data.data;
    return accessToken;
  } catch (error) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    window.location.href = "/login";
    toast.error("Phiên của bạn đã hết hạn !");
    return null;
  }
};

APIsCustomize.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.config && error.response && +error.response.status === 401 && error.config.url !== "/api/v1/auth/login" && !error.config.headers[NO_RETRY_HEADER]) {
      const access_token = await handleRefreshToken();
      error.config.headers[NO_RETRY_HEADER] = "true";
      if (access_token) {
        error.config.headers["Authorization"] = `Bearer ${access_token}`;
        localStorage.setItem("access_token", access_token);
        return instance.request(error.config);
      }
    }
    return Promise.reject(error);
  }
);

export default APIsCustomize;
