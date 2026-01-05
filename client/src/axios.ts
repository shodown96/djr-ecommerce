import axios from "axios";
import { endpoint } from "./constants";

export const authAxios = axios.create({
  baseURL: endpoint,
  headers: {
    Authorization: `Token ${localStorage.getItem("token")}`
    // Authorization: "Token 4c5890382aecabbfd2d46aca6ecfd6e1048c8b5d"
  }
});

// Add a request interceptor
authAxios.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");
  config.headers.Authorization = `Token ${token}`;

  return config;
});