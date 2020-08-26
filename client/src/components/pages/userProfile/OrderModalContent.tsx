import React from "react";
import { toPersianDigits } from "../../../util/index";
import CustomTitle from "../../ui/customTitle";
import CustomTable from "../../ui/customTable";

export interface OrderModalContentProps {
  restaurantName: string;
  totalPrice: number;
  tBody: JSX.Element | JSX.Element[];
}

export interface OrderModalContentState {}

class OrderModalContent extends React.Component<OrderModalContentProps, OrderModalContentState> {
  tHeader: JSX.Element = (
    <tr>
      <th>ردیف</th>
      <th>نام غذا</th>
      <th>تعداد</th>
      <th>قیمت</th>
    </tr>
  );

  render() {
    return (
      <React.Fragment>
        <CustomTitle
          text={` رستوران ${this.props.restaurantName}`}
          classNm="mb-4"
          textStyle="font-weight-light"
        />
        <div className="popup__body">
          <div className="table-responsive profile__orders-table">
            <CustomTable tHeader={this.tHeader} tBody={this.props.tBody} />
          </div>
        </div>
        <p className="text-left font-weight-bold" id="total-price">
          {`جمع کل: ${toPersianDigits(this.props.totalPrice.toLocaleString())} تومان`}
        </p>
      </React.Fragment>
    );
  }
}

export default OrderModalContent;
