import { CartItemType } from "../../actions";
import { CartType } from "./index";

export const addItem = (cartItems: CartItemType[], itemToAdd: CartItemType) => {
  const existingItem = cartItems.find(item => item.name === itemToAdd.name);

  if (existingItem) {
    return cartItems.map(item => {
      if (item.name === existingItem.name) {
        return { ...item, quantity: itemToAdd.quantity! };
      } else return item;
    });
  }
  return [...cartItems, { ...itemToAdd, quantity: itemToAdd.quantity }];
};

export const removeItem = (state: CartType, itemToRemove: CartItemType) => {
  const existingItem = state.cartItems.find(item => item.name === itemToRemove.name);

  if (existingItem?.quantity === 1) {
    const newCartItems = state.cartItems.filter(item => item.name !== itemToRemove.name);
    if (state.cartItems.length === 1)
      return {
        ...state,
        cartId: "",
        cartItems: newCartItems
      };
    return {
      ...state,
      cartItems: newCartItems
    };
  }
  return {
    ...state,
    cartItems: state.cartItems.map(item =>
      item.name === itemToRemove.name ? { ...item, quantity: item.quantity! - 1 } : item
    )
  };
};
