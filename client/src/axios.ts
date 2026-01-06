import axios from "axios";
import { API_ENDPOINTS } from "./constants/api";

export const axiosClient = axios.create({
  baseURL: API_ENDPOINTS.Base,
  headers: {
    Authorization: `Token ${localStorage.getItem("token")}`
  }
});

// Add a request interceptor
axiosClient.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");
  config.headers.Authorization = `Token ${token}`;

  return config;
});