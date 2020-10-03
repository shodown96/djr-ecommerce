import axios from "axios";
import { endpoint } from "./constants";

export const authAxios = axios.create({
  baseURL: endpoint,
  headers: {
    // Authorization: `Token ${localStorage.getItem("token")}`
    // Authorization: "Token 4c5890382aecabbfd2d46aca6ecfd6e1048c8b5d"
  }
});

// Add a request interceptor
// axios.interceptors.request.use(function (config) {
//   const token = store.getState().session.token;
//   config.headers.Authorization =  token;

//   return config;
// });
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.common['Authorization'] = store.getState().session.token;
// // If you want, you can create a self-executable function which will set authorization header itself when the token is present in the store.

// (function() {
//      String token = store.getState().session.token;
//      if (token) {
//          axios.defaults.headers.common['Authorization'] = token;
//      } else {
//          axios.defaults.headers.common['Authorization'] = null;
//          /*if setting null does not remove `Authorization` header then try     
//            delete axios.defaults.headers.common['Authorization'];
//          */
//      }
// })();