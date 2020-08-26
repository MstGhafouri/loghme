import {
  User,
  SetCurrentUserAction,
  ActionTypes,
  FinalizedOrders,
  RaiseUserCreditAction,
  FetchUserOrdersAction,
  FinalizeOrderAction,
  GoogleSignInAction,
  TempUser
} from "../../actions";

const INITIAL_STATE = {
  currentUser: null,
  userOrders: [],
  temporaryUser: undefined
};

export interface UserStateType {
  currentUser: User | null;
  userOrders: FinalizedOrders[];
  temporaryUser: TempUser | undefined;
}

type userActionsTypes =
  | SetCurrentUserAction
  | RaiseUserCreditAction
  | FetchUserOrdersAction
  | FinalizeOrderAction
  | GoogleSignInAction;

export const userReducer = (state: UserStateType = INITIAL_STATE, action: userActionsTypes) => {
  switch (action.type) {
    case ActionTypes.setCurrentUser:
    case ActionTypes.finalizeOrderSuccess:
      return { ...state, currentUser: action.payload, temporaryUser: undefined };
    case ActionTypes.chargeUserCreditSuccess:
      return { ...state, currentUser: { ...state.currentUser!, credit: action!.payload!.credit } };
    case ActionTypes.getUserOrdersSuccess:
      return { ...state, userOrders: action.payload };
    case ActionTypes.googleSignInSuccess:
      return { ...state, temporaryUser: action.payload };
    default:
      return state;
  }
};
