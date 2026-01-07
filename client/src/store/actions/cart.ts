import { axiosClient } from "../../axios";
import { API_ENDPOINTS } from "../../constants/api";
import { CART_FAIL, CART_START, CART_SUCCESS } from "./actionTypes";

// --------- BASIC ACTIONS ---------

export const cartStart = () => ({
  type: CART_START,
});

export const cartSuccess = (data: any) => ({
  type: CART_SUCCESS,
  data,
});

export const cartFail = (error: any) => ({
  type: CART_FAIL,
  error,
});

// --------- THUNK ---------

export const fetchCart = () => {
  return (dispatch: any) => {
    dispatch(cartStart());

    axiosClient
      .get(API_ENDPOINTS.Orders.OrderSummary)
      .then((res) => {
        dispatch(cartSuccess(res.data.data));
      })
      .catch((err) => {
        dispatch(cartFail(err));
      });
  };
};
