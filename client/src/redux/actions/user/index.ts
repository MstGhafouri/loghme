import { Dispatch } from "redux";
import { ActionTypes, User, StatusCodes, Orders, FinalizedOrders, TempUser } from "../types";
import { handleException, handleFoodPartyCartItem } from "../utility";
import { displayConditionalToast } from "../../../util";
import { StateStore } from "../../reducers";
import { removeAllCartItems } from "../cart/index";
import loghmeApi from "../../../api/loghmeApi";
import history from "../../../history";
import { signUpFormParams } from "./../types";

export interface SetCurrentUserAction {
  type: ActionTypes.setCurrentUser;
  payload: User;
}

export interface SignInUserAction {
  type: ActionTypes.signInUserSuccess;
  payload: User;
}

export interface GoogleSignInAction {
  type: ActionTypes.googleSignInSuccess;
  payload: TempUser;
}

export interface SignUpUserAction {
  type: ActionTypes.signUpUserSuccess;
  payload: User;
}

export interface RaiseUserCreditAction {
  type: ActionTypes.chargeUserCreditSuccess;
  payload: User;
}

export interface FinalizeOrderAction {
  type: ActionTypes.finalizeOrderSuccess;
  payload: User;
}

export interface FetchUserOrdersAction {
  type: ActionTypes.getUserOrdersSuccess;
  payload: FinalizedOrders[];
}

export const setCurrentUser = (user: User): SetCurrentUserAction => {
  if (!user) localStorage.removeItem("token");
  return {
    type: ActionTypes.setCurrentUser,
    payload: user
  };
};

export const logout = () => {
  return async (dispatch: Dispatch) => {
    try {
      await loghmeApi.get("/users/logout");
      dispatch(setCurrentUser(null));
    } catch (error) {
      handleException(error, dispatch);
    }
  };
};

export const googleSignIn = ({ email, givenName, familyName }: TempUser) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({ type: ActionTypes.googleSignInRequest });

      const response = await loghmeApi.post<{ data: { user: User }; token: string }>(
        "/users/google-login",
        {
          email
        }
      );

      if (response.data.data) {
        dispatch<SignInUserAction>({
          type: ActionTypes.signInUserSuccess,
          payload: response.data.data.user
        });
        localStorage.setItem("token", response.data.token);
        dispatch(setCurrentUser(response.data.data.user));
        dispatch({
          type: ActionTypes.setSearchParams,
          payload: { restaurantName: undefined, foodName: undefined }
        });
        dispatch({ type: ActionTypes.googleSignInSuccess });
        history.push("/profile");
      } else {
        dispatch<GoogleSignInAction>({
          type: ActionTypes.googleSignInSuccess,
          payload: { email, givenName, familyName }
        });
        history.push("/signup");
        displayConditionalToast(
          StatusCodes.unauthorizedUser,
          "جهت تکمبل ثبت‌نام لطفا اطلاعات موردنیاز را وارد کنید"
        );
      }
    } catch (error) {
      dispatch({ type: ActionTypes.googleSignInFailure, payload: error });
      handleException(error, dispatch);
    }
  };
};

export const signInUser = (data: { email: string; password: string }) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({ type: ActionTypes.signInUserRequest });

      const response = await loghmeApi.post<{ data: { user: User }; token: string }>(
        "/users/login",
        data
      );
      dispatch<SignInUserAction>({
        type: ActionTypes.signInUserSuccess,
        payload: response.data.data.user
      });
      localStorage.setItem("token", response.data.token);
      dispatch(setCurrentUser(response.data.data.user));
      dispatch({
        type: ActionTypes.setSearchParams,
        payload: { restaurantName: undefined, foodName: undefined }
      });
      history.push("/profile");
    } catch (error) {
      dispatch({ type: ActionTypes.signInUserFailure, payload: error });
      handleException(error, dispatch);
    }
  };
};

export const signUpUser = (data: signUpFormParams) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({ type: ActionTypes.signUpUserRequest });

      const response = await loghmeApi.post<{ data: { user: User }; token: string }>(
        "/users/signup",
        data
      );
      dispatch<SignUpUserAction>({
        type: ActionTypes.signUpUserSuccess,
        payload: response.data.data.user
      });
      localStorage.setItem("token", response.data.token);
      dispatch(setCurrentUser(response.data.data.user));
      dispatch({
        type: ActionTypes.setSearchParams,
        payload: { restaurantName: undefined, foodName: undefined }
      });
      history.push("/profile");
      displayConditionalToast(StatusCodes.successfulRegister);
    } catch (error) {
      dispatch({ type: ActionTypes.signUpUserFailure, payload: error });
      handleException(error, dispatch);
    }
  };
};

export const raiseUserCredit = (credit: Number) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({ type: ActionTypes.chargeUserCreditRequest });

      const response = await loghmeApi.patch<{ data: { user: User } }>("/users/updateMe", {
        credit
      });
      dispatch<RaiseUserCreditAction>({
        type: ActionTypes.chargeUserCreditSuccess,
        payload: response.data.data.user
      });
      displayConditionalToast(StatusCodes.successfulRaiseCredit);
    } catch (error) {
      dispatch({ type: ActionTypes.chargeUserCreditFailure, payload: error });
      handleException(error, dispatch);
    }
  };
};

export const finalizeOrder = (items: Orders) => {
  return async (dispatch: Dispatch, getStore: () => StateStore) => {
    try {
      if (items.totalAmount > getStore().user.currentUser!?.credit) {
        displayConditionalToast(StatusCodes.creditNotEnough);
        return;
      }

      dispatch({ type: ActionTypes.finalizeOrderRequest });

      const response = await loghmeApi.post<{ data: User }>("/finalize-order", items);
      dispatch<FinalizeOrderAction>({
        type: ActionTypes.finalizeOrderSuccess,
        payload: response.data.data
      });
      dispatch(removeAllCartItems());
      displayConditionalToast(StatusCodes.successfulFinalizedOrders);
      handleFoodPartyCartItem(items, dispatch);
    } catch (error) {
      dispatch({ type: ActionTypes.finalizeOrderFailure, payload: error });
      handleException(error, dispatch);
    }
  };
};

export const fetchUserOrders = (userId: string) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({ type: ActionTypes.getUserOrdersRequest });

      const response = await loghmeApi.get<{ data: FinalizedOrders[] }>(`/orders/${userId}`);
      dispatch<FetchUserOrdersAction>({
        type: ActionTypes.getUserOrdersSuccess,
        payload: response.data.data
      });
    } catch (error) {
      dispatch({ type: ActionTypes.getUserOrdersFailure, payload: error });
      handleException(error, dispatch);
    }
  };
};

export const forgotPassword = (email: string) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({ type: ActionTypes.forgotPasswordRequest });

      const response = await loghmeApi.post<{ message: string }>("/users/forgot-password", {
        email
      });
      dispatch({
        type: ActionTypes.forgotPasswordSuccess,
        payload: response.data.message
      });
      displayConditionalToast(StatusCodes.success, response.data.message);
    } catch (error) {
      dispatch({ type: ActionTypes.forgotPasswordFailure, payload: error });
      handleException(error, dispatch);
    }
  };
};

export const changeUserPassword = (
  data: { password: string; passwordConfirm: string },
  token: string
) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({ type: ActionTypes.resetPasswordRequest });

      const response = await loghmeApi.patch<{ data: { user: User }; token: string }>(
        `/users/reset-password/${token}`,
        data
      );
      dispatch({
        type: ActionTypes.resetPasswordSuccess,
        payload: response.data.data.user
      });
      localStorage.setItem("token", response.data.token);
      dispatch(setCurrentUser(response.data.data.user));
      dispatch({
        type: ActionTypes.setSearchParams,
        payload: { restaurantName: undefined, foodName: undefined }
      });
      displayConditionalToast(StatusCodes.success, "تغییر رمزعبور شما با موفقیت انجام شد");
      history.push("/profile");
    } catch (error) {
      dispatch({ type: ActionTypes.resetPasswordFailure, payload: error });
      handleException(error, dispatch);
    }
  };
};
