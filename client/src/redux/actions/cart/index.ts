import { ActionTypes, CartItemType, StatusCodes } from "../types";
import { Dispatch } from "redux";
import { handleModals } from "../ui";
import { StateStore } from "../../reducers/index";
import { displayConditionalToast } from "../../../util";

export interface AddToCartAction {
  type: ActionTypes.addToCart;
  payload: CartItemType;
}

export interface RemoveCartItemAction {
  type: ActionTypes.removeCartItem;
  payload: CartItemType;
}

export interface RemoveAllCartItemsAction {
  type: ActionTypes.removeAllCartItems;
}

export const addToCart = (item: CartItemType) => {
  return (dispatch: Dispatch, getStore: () => StateStore) => {
    const {
      cart: { cartId },
      clickedModal: { name }
    } = getStore();
    
    if (name !== "cart") dispatch(handleModals(false, item.name));

    if (cartId && item.restaurantId !== cartId) {
      // In this case we are going to throw an error !
      // Because user just can add foods of the same restaurant
      displayConditionalToast(StatusCodes.failedAddItem);
    }
    else if (item.type === "foodParty" && item.quantity > item.maxCount!) {
      displayConditionalToast(StatusCodes.failedAddFoodParty);
    }
     else {
      dispatch<AddToCartAction>({
        type: ActionTypes.addToCart,
        payload: item
      });
      displayConditionalToast(StatusCodes.successfulAddItem);
    }
  };
};

export const removeAllCartItems = (): RemoveAllCartItemsAction => {
  return {
    type: ActionTypes.removeAllCartItems
  };
};

export const removeCartItem = (item: CartItemType) => {
  return (dispatch: Dispatch) => {
    dispatch<RemoveCartItemAction>({
      type: ActionTypes.removeCartItem,
      payload: item
    });
  };
};
