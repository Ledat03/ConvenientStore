import axios from "axios";

const APIsCustomize = axios.create({
  baseURL: "http://localhost:8080/",
});

APIsCustomize.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

APIsCustomize.interceptors.response.use(
  function (response) {
    console.log("interceptor >>>", response);
    return response;
  },
  function (error) {
    console.log("Error >>> ", error);
    return Promise.reject(error);
  }
);

export default APIsCustomize;
