import { authAxios } from "../../axios";
import { orderSummaryURL } from "../../constants";
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

    authAxios
      .get(orderSummaryURL)
      .then((res) => {
        dispatch(cartSuccess(res.data));
      })
      .catch((err) => {
        dispatch(cartFail(err));
      });
  };
};
