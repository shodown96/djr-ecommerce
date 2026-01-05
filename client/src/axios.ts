import axios from "axios";
import { endpoint } from "./constants";

export const authAxios = axios.create({
  baseURL: endpoint,
  headers: {
    Authorization: `Token ${localStorage.getItem("token")}`
  }
});

// Add a request interceptor
authAxios.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");
  config.headers.Authorization = `Token ${token}`;

  return config;
});