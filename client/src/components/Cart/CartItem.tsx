import React from "react";
import { connect } from "react-redux";
import { CartItemType, addToCart, removeCartItem, StatusCodes } from "../../redux/actions";
import { toPersianDigits, displayConditionalToast } from "./../../util/index";

export interface CartItemProps extends CartItemType {
  addToCart: Function;
  removeCartItem: Function;
}

class CartItem extends React.Component<CartItemProps> {
  onAddItem = () => {
    const { name, price, quantity, restaurantId, addToCart, maxCount, type } = this.props;
    if (type === "foodParty" && quantity >= maxCount!)
      displayConditionalToast(StatusCodes.failedAddFoodParty);
    else addToCart({ name, price, quantity: quantity + 1, restaurantId, maxCount, type });
  };

  render() {
    const { name, price, quantity, restaurantId, removeCartItem } = this.props;
    return (
      <li className="cart__item">
        <div className="cart__item--info">
          <p className="cart__item--name">{name}</p>
          <div className="quantity-box">
            <i className="flaticon-plus text-success" onClick={this.onAddItem}></i>
            <span className="text-center">{toPersianDigits(quantity!)}</span>
            <i
              className="flaticon-minus text-danger"
              onClick={e => removeCartItem({ name, price, quantity, restaurantId })}
            ></i>
          </div>
        </div>
        <p className="cart__item--price">{`${toPersianDigits(price.toLocaleString())} تومان`}</p>
      </li>
    );
  }
}

export default connect(null, { addToCart, removeCartItem })(CartItem);
