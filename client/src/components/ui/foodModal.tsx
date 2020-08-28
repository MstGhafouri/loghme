/* eslint-disable jsx-a11y/accessible-emoji */
import React from "react";
import { connect } from "react-redux";
import { FoodType, addToCart } from "../../redux/actions";
import { CustomBtn } from "./buttons";
import { toPersianDigits } from "./../../util/index";
import { StateStore } from "../../redux/reducers";

export interface FoodModalContentProps extends FoodType {
  restaurantName: string;
  restaurantId: string;
  oldPrice?: number;
  count?: number;
  type: "food" | "foodParty";
  maxCount?: number;
  addToCart: Function;
  cartItemQuantity: number;
}

class FoodModalContent extends React.Component<FoodModalContentProps> {
  state = {
    quantity: 1
  };

  onIncrementClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    if (this.props.count) {
      if (this.state.quantity < this.props.count)
        this.setState({ quantity: this.state.quantity + 1 });
    } else this.setState({ quantity: this.state.quantity + 1 });
  };

  onDecrementClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    if (this.state.quantity > 1) this.setState({ quantity: this.state.quantity - 1 });
  };

  render() {
    const {
      name,
      restaurantName,
      restaurantId,
      image,
      price,
      oldPrice,
      description,
      popularity,
      count,
      type,
      maxCount,
      cartItemQuantity,
      _id
    } = this.props;

    return (
      <React.Fragment>
        <h2 className="popup__heading heading-secondary text-center mt-4 mb-3">{restaurantName}</h2>
        <div className="popup__body">
          <figure className="popup__fig">
            <img src={image} className="popup__fig--img" alt="pizza" />
          </figure>

          <div className="popup__info">
            <div className="food-popularity">
              <p className="ml-3">{name}</p>
              <h4>
                ⭐<span>{popularity > 0.6 ? "۵" : "۴"}</span>
              </h4>
            </div>
            <p className="popup__info--desc text-muted">{description}</p>
            <div className="foodParty__card--price">
              <h4
                className={`foodParty__card--cur-price ${oldPrice ? "text-center" : "text-right"}`}
              >{`${toPersianDigits(price.toLocaleString())} تومان`}</h4>
              {oldPrice && (
                <h4 className="foodParty__card--old-price text-center">
                  <span className="inner">{toPersianDigits(oldPrice.toLocaleString())}</span>
                </h4>
              )}
            </div>
          </div>
        </div>

        <div className={`popup__footer ${oldPrice ? "" : "justify-content-end"}`}>
          {oldPrice && (
            <div className="text-center ml-auto card-box">
              <p className="text-muted px-2 py-1">{`موجودی: ${count}`}</p>
            </div>
          )}
          <div className="quantity-box">
            <i className="flaticon-plus text-success" onClick={this.onIncrementClick}></i>
            <span className="text-center">{toPersianDigits(this.state.quantity)}</span>
            <i className="flaticon-minus text-danger" onClick={this.onDecrementClick}></i>
          </div>
          <CustomBtn
            type="button"
            classNm="animated-btn--light"
            text="  افزودن به سبد خرید"
            onClick={() =>
              this.props.addToCart({
                name,
                price,
                restaurantId,
                type,
                maxCount,
                itemId: _id,
                quantity: this.state.quantity + cartItemQuantity
              })
            }
          />
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ cart: { cartItems } }: StateStore, ownProps: any) => {
  const cartItem = cartItems.find(item => item.name === ownProps.name);
  return { cartItemQuantity: cartItem ? cartItem.quantity : 0 };
};

export default connect(mapStateToProps, { addToCart })(FoodModalContent);
