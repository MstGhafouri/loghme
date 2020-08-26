import React from "react";
import OrdersList from "./OrdersList";

export interface OrdersTabProps {}

class OrdersTab extends React.Component<OrdersTabProps> {
  render() {
    return (
      <div id="orders-body" style={{ position: "relative" }}>
        <OrdersList />
      </div>
    );
  }
}

export default OrdersTab;
