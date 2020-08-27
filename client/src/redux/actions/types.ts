export interface FoodType {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  popularity: number;
}

export interface FoodPartyType extends FoodType {
  count: number;
  oldPrice: number;
}

export interface RestaurantsType {
  id: string;
  name: string;
  logo: string;
  slug: string;
  menu: FoodType[];
}

export interface FoodPartiesType extends RestaurantsType {
  menu: FoodPartyType[];
}

export interface CartItemType {
  type: "food" | "foodParty";
  maxCount?: number;
  name: string;
  quantity: number;
  price: number;
  restaurantId: string;
  id: number;
}

type userFields = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  credit: number;
};
export type User = userFields | null;

export type TempUser = {
  email: string;
  givenName: string;
  familyName: string;
};

export interface signUpFormParams {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export type orderStatus = "done" | "findingDelivery" | "delivering";

export interface Orders {
  userId: number;
  restaurantId: string;
  totalAmount: number;
  cartItems: CartItemType[];
}

export interface FinalizedOrders {
  id: number;
  totalAmount: number;
  restaurantName: string;
  status: orderStatus;
  size: number;
  orders: CartItemType[];
}

export type searchParamsType = { restaurantName?: string; foodName?: string };

export enum ActionTypes {
  getRestaurantsRequest = "GET_RESTAURANTS_REQUEST",
  getRestaurantsSuccess = "GET_RESTAURANTS_SUCCESS",
  getRestaurantsFailure = "GET_RESTAURANTS_FAILURE",

  getRestaurantRequest = "GET_RESTAURANT_REQUEST",
  getRestaurantSuccess = "GET_RESTAURANT_SUCCESS",
  getRestaurantFailure = "GET_RESTAURANT_FAILURE",

  getFoodPartiesRequest = "GET_FOOD_PARTIES_REQUEST",
  getFoodPartiesSuccess = "GET_FOOD_PARTIES_SUCCESS",
  getFoodPartiesFailure = "GET_FOOD_PARTIES_FAILURE",

  getUserOrdersRequest = "GET_USER_ORDERS_REQUEST",
  getUserOrdersSuccess = "GET_USER_ORDERS_SUCCESS",
  getUserOrdersFailure = "GET_USER_ORDERS_FAILURE",

  chargeUserCreditRequest = "CHARGE_CREDIT_REQUEST",
  chargeUserCreditSuccess = "CHARGE_CREDIT_SUCCESS",
  chargeUserCreditFailure = "CHARGE_CREDIT_FAILURE",

  finalizeOrderRequest = "FINALIZE_ORDER_REQUEST",
  finalizeOrderSuccess = "FINALIZE_ORDER_SUCCESS",
  finalizeOrderFailure = "FINALIZE_ORDER_FAILURE",

  signInUserRequest = "SIGN_IN_USER_REQUEST",
  signInUserSuccess = "SIGN_IN_USER_SUCCESS",
  signInUserFailure = "SIGN_IN_USER_FAILURE",

  signUpUserRequest = "SIGN_UP_USER_REQUEST",
  signUpUserSuccess = "SIGN_UP_USER_SUCCESS",
  signUpUserFailure = "SIGN_UP_USER_FAILURE",

  googleSignInRequest = "GOOGLE_SIGN_IN_REQUEST",
  googleSignInSuccess = "GOOGLE_SIGN_IN_SUCCESS",
  googleSignInFailure = "GOOGLE_SIGN_IN_FAILURE",

  forgotPasswordRequest = "FORGOT_PASSWORD_REQUEST",
  forgotPasswordSuccess = "FORGOT_PASSWORD_SUCCESS",
  forgotPasswordFailure = "FORGOT_PASSWORD_FAILURE",

  resetPasswordRequest = "RESET_PASSWORD_REQUEST",
  resetPasswordSuccess = "RESET_PASSWORD_SUCCESS",
  resetPasswordFailure = "RESET_PASSWORD_FAILURE",

  handleModals = "HANDLE_MODALS",
  setCurrentUser = "SET_CURRENT_USER",
  addToCart = "ADD_TO_CART",
  removeCartItem = "REMOVE_CART_ITEM",
  stopTimer = "STOP_FOOD_PARTY_TIMER",
  startTimer = "START_FOOD_PARTY_TIMER",
  resetTimer = "RESET_FOOD_PARTY_TIMER",
  FetchData = "FETCH_DATA",
  removeAllCartItems = "REMOVE_ALL_CART_ITEMS",
  getTotalRestaurants = "getTotalRestaurants",
  setSearchParams = "setSearchParams"
}

export type asyncActionsNameType =
  | "GET_FOOD_PARTIES"
  | "GET_RESTAURANTS"
  | "GET_RESTAURANT"
  | "GET_USER_ORDERS"
  | "CHARGE_CREDIT"
  | "FINALIZE_ORDER"
  | "SIGN_IN_USER"
  | "SIGN_UP_USER"
  | "GOOGLE_SIGN_IN"
  | "RESET_PASSWORD"
  | "FORGOT_PASSWORD";

export enum StatusCodes {
  notFound = 404,
  unauthorized = 401,
  forbidden = 403,
  badRequest = 400,
  internalErr = 500,
  success = 200,
  successfulAddItem,
  failedAddItem,
  successfulRaiseCredit,
  successfulFinalizedOrders,
  failedAddFoodParty,
  creditNotEnough,
  unauthorizedUser,
  successfulRegister
}
