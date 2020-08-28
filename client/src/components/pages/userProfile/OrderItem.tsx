import React, { ReactNode } from "react";
import { connect } from "react-redux";
import { handleModals } from "../../../redux/actions";
import { orderStatus, FinalizedOrders } from "../../../redux/actions/types";
import { CustomBtn } from "../../ui/buttons";
import { toPersianDigits } from "../../../util";
import { StateStore } from "../../../redux/reducers/index";
import InfoBox from "../../ui/infoBox";
import Popup from "../../Popup/index.";
import OrderModalContent from "./OrderModalContent";

export interface OrderItemProps extends FinalizedOrders {
  index: number;
  handleModals: typeof handleModals;
  clickedModal: { name: string; open: boolean };
}

class OrderItem extends React.Component<OrderItemProps> {
  config = {
    delivering: {
      classNm: "card-box card-box--green",
      textStyle: "text-success px-2 py-1",
      text: "پیک در مسیر"
    },
    findingDelivery: {
      classNm: "card-box card-box--light",
      textStyle: "text-primary px-2 py-1",
      text: "در جست‌وجو پیک"
    },
    delivered: {
      classNm: "animated-btn--gold",
      text: "مشاهده فاکتور",
      textStyle: ""
    }
  };

  renderBody = (): JSX.Element[] => {
    return this.props.cartItems.map((food, i) => {
      return (
        <tr key={i}>
          <td>{toPersianDigits(i + 1)}</td>
          <td>{food.name}</td>
          <td>{toPersianDigits(food.quantity)}</td>
          <td>{toPersianDigits(food.price.toLocaleString())}</td>
        </tr>
      );
    });
  };

  renderStatusBox = (status: orderStatus): ReactNode => {
    const { classNm, text, textStyle } = this.config[status];
    if (status === "delivered")
      return (
        <CustomBtn
          text={text}
          classNm={classNm}
          onClick={e => this.props.handleModals(true, this.props._id.toString())}
        />
      );
    return (
      <InfoBox classNm={classNm} textStyle={textStyle}>
        {text}
      </InfoBox>
    );
  };

  render() {
    const { index, restaurantName, status, clickedModal, _id, totalPrice } = this.props;
    return (
      <React.Fragment>
        <li className="profile__order">
          <span>{toPersianDigits(index)}</span>
          <p>{restaurantName}</p>
          <div>{this.renderStatusBox(status)}</div>
        </li>
        <Popup
          open={clickedModal.open && clickedModal.name === _id.toString()}
          name={_id.toString()}
          contentClassNm="profile-popup__content"
        >
          <OrderModalContent
            restaurantName={restaurantName}
            totalPrice={totalPrice}
            tBody={this.renderBody()}
          />
        </Popup>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({
  clickedModal
}: StateStore): { clickedModal: { open: boolean; name: string } } => {
  return { clickedModal };
};

export default connect(mapStateToProps, { handleModals })(OrderItem);
