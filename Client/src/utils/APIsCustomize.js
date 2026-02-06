import axios from "axios";

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
  }
);

APIsCustomize.interceptors.response.use(
  (res) => {
    console.log("Response success:", res);
    return res;
  },
  async (error) => {
    console.log("Error occurred:", error);
    if (error.response.status === 401) {
      console.log(error.config.url);
      if (!error.config.url?.includes("refresh") && !error.config._retry) {
        error.config._retry = true;
        try {
          const response = await APIsCustomize.post("api/check/auth/refresh");
          console.log(response);
          localStorage.setItem("accessToken", response.data.accessToken);
          return APIsCustomize.request(error.config);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
    if (error.response.status === 403) {
      try {
        const response = await APIsCustomize.get("api/check/auth/refresh");
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
