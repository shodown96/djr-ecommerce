import { axiosClient } from "../../axios";
import {
  API_ENDPOINTS
} from "../../constants/api";
import type { SignUpPayload } from "../../types";
import * as actionTypes from "./actionTypes";
import { fetchCart } from "./cart";

// --------- BASIC ACTIONS ---------

export const authStart = () => ({
  type: actionTypes.AUTH_START,
});

export const authSuccess = (token: string, user: any = {}) => {
  axiosClient.defaults.headers.Authorization = `Bearer ${token}`;
  return {
    type: actionTypes.AUTH_SUCCESS,
    token,
    user,
  };
};

export const authFail = (error: any) => ({
  type: actionTypes.AUTH_FAIL,
  error,
});

export const profileUpdated = (user: any = {}) => ({
  type: actionTypes.PROFILE_UPDATED,
  user,
});

export const signOut = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("expiration");
  delete axiosClient.defaults.headers.Authorization;

  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

// --------- HELPERS ---------

export const checkAuthTimeout = (expirationSeconds: number) => {
  return (dispatch: any) => {
    setTimeout(() => {
      dispatch(signOut());
    }, expirationSeconds * 1000);
  };
};

// --------- AUTH FLOWS ---------

export const authSignIn = (username: string, password: string) => {
  return (dispatch: any) => {
    dispatch(authStart());

    axiosClient
      .post(API_ENDPOINTS.Auth.SignIn, { username, password })
      .then((res) => {
        const token = res.data.data.access;
        const expiration = Date.now() + 3600 * 1000;

        localStorage.setItem("token", token);
        localStorage.setItem("expiration", expiration.toString());

        dispatch(authSuccess(token));
        dispatch(authGetDetails());
        dispatch(fetchCart());
        dispatch(checkAuthTimeout(3600));
      })
      .catch((err) => dispatch(authFail(err)));
  };
};

export const authSignUp = (data: SignUpPayload) => {
  return (dispatch: any) => {
    dispatch(authStart());

    axiosClient
      .post(API_ENDPOINTS.Auth.SignUp, data)
      .then((res) => {
        const token = res.data.data.tokens.access;
        const expiration = Date.now() + 3600 * 1000;

        localStorage.setItem("token", token);
        localStorage.setItem("expiration", expiration.toString());

        dispatch(authSuccess(token));
        dispatch(authGetDetails());
        dispatch(checkAuthTimeout(3600));
      })
      .catch((err) => dispatch(authFail(err)));
  };
};

// --------- SESSION RESTORE ---------

export const authCheckState = () => {
  return (dispatch: any) => {
    const token = localStorage.getItem("token");
    const expiration = localStorage.getItem("expiration");

    if (!token || !expiration) {
      dispatch(signOut());
      return;
    }

    if (Number(expiration) <= Date.now()) {
      dispatch(signOut());
      return;
    }

    dispatch(authSuccess(token));
    dispatch(authGetDetails());
    dispatch(fetchCart());

    const remainingSeconds =
      (Number(expiration) - Date.now()) / 1000;

    dispatch(checkAuthTimeout(remainingSeconds));
  };
};

// --------- PROFILE ---------

export const authGetDetails = () => {
  return (dispatch: any) => {
    axiosClient
      .get(API_ENDPOINTS.Auth.Me)
      .then((res) => dispatch(profileUpdated(res.data.data)))
      .catch((err) => dispatch(authFail(err)));
  };
};

export const authUpdateDetails = (data: any) => {
  return (dispatch: any) => {
    dispatch(authStart());

    axiosClient
      .put(API_ENDPOINTS.Auth.Me, data)
      .then((res) => dispatch(profileUpdated(res.data.data)))
      .catch((err) => dispatch(authFail(err)));
  };
};

export const authDeleteAccount = () => {
  return (dispatch: any) => {
    dispatch(authStart());

    axiosClient
      .delete(API_ENDPOINTS.Auth.Me)
      .then(() => dispatch(signOut()))
      .catch((err) => dispatch(authFail(err)));
  };
};
