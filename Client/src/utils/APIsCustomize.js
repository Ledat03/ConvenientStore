import axios from "axios";
import { fetchLogOut } from "../services/AuthAPI";
const APIsCustomize = axios.create({
  baseURL: "http://localhost:8080/",
  withCredentials: true,
});
APIsCustomize.interceptors.request.use(
  (config) => {
    const getToken = localStorage.getItem("accessToken");
    if (getToken && !config.url.includes("api/check")) {
      config.headers["Authorization"] = `Bearer ${getToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

APIsCustomize.interceptors.response.use(
  (res) => {
    console.log("Response success:", res);
    return res;
  },
  async (error) => {
    let user = localStorage.getItem("user");
    if (user == null) {
      return Promise.reject(error);
    }
    console.log("Error occurred:", error.response.data);
    if (error.response.status === 401) {
      console.log(error.config.url);
      if (!error.config.url?.includes("refresh") && !error.config._retry) {
        error.config._retry = true;
        try {
          const response = await APIsCustomize.post("api/check/auth/refresh");
          console.log("1", response.status);
          if (response.status === 200) {
            localStorage.setItem("accessToken", response.data.accessToken);
            return APIsCustomize.request(error.config);
          }
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
    if (error.response.status === 403) {
      try {
        await fetchLogOut();
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/authenticate";
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default APIsCustomize;
