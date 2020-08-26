import { CartItemType, AddToCartAction, ActionTypes, RemoveCartItemAction } from "./../../actions";
import { addItem, removeItem } from "./cartUtil";
import { RemoveAllCartItemsAction } from "./../../actions/cart/index";

const INITIAL_STATE = {
  cartId: "",
  cartItems: []
};

export interface CartType {
  cartId: string;
  cartItems: CartItemType[];
}

type CartActions = AddToCartAction | RemoveCartItemAction | RemoveAllCartItemsAction;

export const cartReducer = (state: CartType = INITIAL_STATE, action: CartActions) => {
  switch (action.type) {
    case ActionTypes.addToCart:
      if (!state.cartId)
        // Set cartId just for the first time
        return {
          ...state,
          cartId: action.payload.restaurantId,
          cartItems: addItem(state.cartItems, action.payload)
        };
      return {
        ...state,
        cartItems: addItem(state.cartItems, action.payload)
      };

    case ActionTypes.removeCartItem:
      return removeItem(state, action.payload);
    case ActionTypes.removeAllCartItems:
      return { ...state, ...INITIAL_STATE };
    default:
      return state;
  }
};
