import { CART_START, CART_SUCCESS, CART_FAIL, AUTH_LOGOUT } from "../actions/actionTypes";

export interface CartState {
  shoppingCart: any | null;
  loading: boolean;
  error: any;
}

const initialState: CartState = {
  shoppingCart: null,
  loading: false,
  error: null,
};

const reducer = (
  state: CartState = initialState,
  action: any
): CartState => {
  switch (action.type) {
    case CART_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case CART_SUCCESS:
      return {
        ...state,
        shoppingCart: action.data,
        loading: false,
        error: null,
      };

    case CART_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    case AUTH_LOGOUT:
      return {
        ...initialState,
      };

    default:
      return state;
  }
};

export default reducer;
