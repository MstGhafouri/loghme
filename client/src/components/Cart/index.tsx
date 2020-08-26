import React from "react";
import { connect } from "react-redux";
import { StateStore } from "../../redux/reducers/index";
import { CustomBtn } from "../ui/buttons";
import { CartItemType, finalizeOrder, User, StatusCodes } from "../../redux/actions";
import { toPersianDigits, displayConditionalToast } from "./../../util/index";
import { createLoadingSelector } from "../../redux/reducers/loading";
import CartItem from "./CartItem";
import Loader from "../Loader";

export interface CartContentProps {
  cartItems: CartItemType[];
  finalizeOrder: Function;
  totalAmount: number;
  restaurantId: string;
  currentUser: User | null;
  isFetching: boolean;
}

class CartContent extends React.Component<CartContentProps> {
  renderCartItems = () => {
    return this.props.cartItems.map((item, i) => {
      return <CartItem key={i} {...item} />;
    });
  };

  onFinalizeBtnClick = () => {
    if (!this.props.currentUser) {
      displayConditionalToast(StatusCodes.unauthorizedUser);
      return;
    }
    const { cartItems, totalAmount, finalizeOrder, restaurantId, currentUser } = this.props;
    finalizeOrder({ totalAmount, cartItems, restaurantId, userId: currentUser.id });
  };

  render() {
    const { cartItems, totalAmount, isFetching } = this.props;
    return (
      <React.Fragment>
        <h3 className="cart__heading text-center mb-3">سبد خرید</h3>
        <div className="cart__body px-5 py-3">
          <ul className="cart__list">
            {cartItems.length ? (
              this.renderCartItems()
            ) : (
              <h5 className="text-muted">سبد خرید شما خالی می‌باشد</h5>
            )}
          </ul>
          <h3 className="cart__total-price mb-4">
            {`جمع کل: ${
              cartItems.length ? `${toPersianDigits(totalAmount.toLocaleString())} تومان` : "-----"
            }`}
          </h3>
          <CustomBtn
            text="تایید نهایی"
            type="button"
            classNm={`animated-btn--light cart__finalize-btn ${cartItems.length ? "" : "disabled"}`}
            onClick={this.onFinalizeBtnClick}
            disabled={cartItems.length ? false : true}
          />
        </div>
        <Loader loading={isFetching} position="fixed" />
      </React.Fragment>
    );
  }
}

type cartStateTypes = {
  cartItems: CartItemType[];
  isFetching: boolean;
  restaurantId: string;
  currentUser: User | null;
  totalAmount: number;
};

const loadingSelector = createLoadingSelector(["FINALIZE_ORDER"]);

const mapStateToProps = (state: StateStore): cartStateTypes => {
  const {
    cart: { cartItems, cartId },
    user: { currentUser }
  } = state;

  return {
    cartItems,
    restaurantId: cartId,
    currentUser,
    isFetching: loadingSelector(state),
    totalAmount: cartItems.reduce((acc, item) => acc + item.price * item.quantity!, 0)
  };
};

export default connect(mapStateToProps, { finalizeOrder })(CartContent);
