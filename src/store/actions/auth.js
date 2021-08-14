import axios from "axios";
import * as actionTypes from "./actionTypes";
import host, { userDetailURL } from "../../constants"
import { authAxios } from "../../utils";
import { logCart } from "./cart"
export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
};

export const authSuccess = (token, user = {}) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token: token,
    user,
  };
};

export const authFail = error => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  };
};
export const profileUpdated = (user = {}) => {
  return {
    type: actionTypes.PROFILE_UPDATED,
    user,
  };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("expirationDate");
  return {
    type: actionTypes.AUTH_LOGOUT
  };
};

export const checkAuthTimeout = expirationTime => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

export const authLogin = (username, password) => {
  return dispatch => {
    dispatch(authStart());
    axios
      .post(`${host}/rest-auth/login/`, {
        username: username,
        password: password
      })
      .then(res => {
        const token = res.data.key;
        authAxios.defaults.headers['Authorization'] = "Token " + token;
        const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
        localStorage.setItem("token", token);
        localStorage.setItem("expirationDate", expirationDate);
        dispatch(authSuccess(token));
        dispatch(authGetDetails(token));
        dispatch(logCart(token));
        dispatch(checkAuthTimeout(3600));
      })
      .catch(err => {
        dispatch(authFail(err));
      });
  };
};

export const authSignup = (username, email, password1, password2) => {
  return dispatch => {
    dispatch(authStart());
    axios
      .post(`${host}/rest-auth/registration/`, {
        username: username,
        email: email,
        password1: password1,
        password2: password2
      })
      .then(res => {
        const token = res.data.key;
        authAxios.defaults.headers['Authorization'] = "Token " + token;
        const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
        localStorage.setItem("token", token);
        localStorage.setItem("expirationDate", expirationDate);
        dispatch(authSuccess(token));
        dispatch(authGetDetails(token));
        dispatch(checkAuthTimeout(3600));
      })
      .catch(err => {
        dispatch(authFail(err));
      });
  };
};

export const authCheckState = () => {
  return dispatch => {
    const token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem("expirationDate"));
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        dispatch(authSuccess(token));
        dispatch(authGetDetails(token));
        dispatch(logCart(token));
        dispatch(
          checkAuthTimeout(
            (expirationDate.getTime() - new Date().getTime()) / 1000
          )
        );
      }
    }
  };
};

// PROFILE FUNCTIONS
export const authGetDetails = (token) => {
  return dispatch => {
    dispatch(authStart());
    axios.get(userDetailURL, { headers: { Authorization: `Token ${token}` } })
      .then(res => {
        dispatch(profileUpdated(res.data));
      })
      .catch(err => {
        dispatch(authFail(err));
      });
  };
};

export const authUpdateDetails = (data) => {
  return dispatch => {
    dispatch(authStart());
    authAxios.put(userDetailURL, data)
      .then(res => {
        dispatch(profileUpdated(res.data));
      })
      .catch(err => {
        dispatch(authFail(err));
      });
  };
};

export const authDeleteAccount = (token) => {
  return dispatch => {
    dispatch(authStart());
    authAxios.delete(userDetailURL)
      .then(res => {
        // console.log(res)
        dispatch(authSuccess(token));
        dispatch(logout())
      })
      .catch(err => {
        dispatch(authFail(err));
      });
  };
};