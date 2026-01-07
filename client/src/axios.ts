import axios from "axios";
import { API_ENDPOINTS } from "./constants/api";

export const axiosClient = axios.create({
  baseURL: API_ENDPOINTS.Base
});

// Add a request interceptor
axiosClient.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");
  // const isAuth = config.url?.includes("auth")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});