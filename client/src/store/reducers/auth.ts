import * as actionTypes from "../actions/actionTypes";

export interface AuthState {
  token: string | null;
  user: any;
  loading: boolean;
  error: any;
}

const initialState: AuthState = {
  token: null,
  user: {},
  loading: false,
  error: null,
};

const reducer = (
  state: AuthState = initialState,
  action: any
): AuthState => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case actionTypes.AUTH_SUCCESS:
      return {
        ...state,
        token: action.token,
        loading: false,
        error: null,
      };

    case actionTypes.PROFILE_UPDATED:
      return {
        ...state,
        user: action.user,
        loading: false,
        error: null,
      };

    case actionTypes.AUTH_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    case actionTypes.AUTH_LOGOUT:
      return {
        ...initialState,
      };

    default:
      return state;
  }
};

export default reducer;
