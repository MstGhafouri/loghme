import React from "react";
import { connect } from "react-redux";
import { StateStore } from "../../../redux/reducers/index";
import { FinalizedOrders } from "../../../redux/actions";
import OrderItem from "./OrderItem";
import Loader from "../../Loader";
import { createLoadingSelector } from "../../../redux/reducers/loading";

export interface OrdersListProps {
  userOrders: FinalizedOrders[];
  isFetching: boolean;
}

class OrdersList extends React.Component<OrdersListProps> {
  renderOrderItems = () => {
    const { userOrders, isFetching } = this.props;
    if (!userOrders.length && !isFetching)
      return <p className="text-center mt-4">لیست سفارش‌های شما خالی می‌باشد</p>;
    if (isFetching) return;
    return userOrders
      .reverse()
      .map((order, i) => <OrderItem key={order.id} {...order} index={i + 1} />);
  };

  render() {
    return (
      <React.Fragment>
        <ul className="profile__orders">{this.renderOrderItems()}</ul>
        <Loader loading={this.props.isFetching} />
      </React.Fragment>
    );
  }
}

const loadingSelector = createLoadingSelector(["GET_USER_ORDERS"]);

const mapStateToProps = (
  state: StateStore
): { userOrders: FinalizedOrders[]; isFetching: boolean } => {
  const {
    user: { userOrders }
  } = state;
  return { userOrders, isFetching: loadingSelector(state) };
};

export default connect(mapStateToProps)(OrdersList);
