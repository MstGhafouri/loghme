import React from "react";
import RestaurantMenuItem from "./RestaurantMenuItem";
import { RestaurantsType } from "../../../redux/actions";

export interface RestaurantMenuListProps {
  restaurant: RestaurantsType;
}

class RestaurantMenuList extends React.Component<RestaurantMenuListProps> {
  renderMenuItems = () => {
    const {
      restaurant: { menu, id, name }
    } = this.props;
    return menu.map(food => {
      return (
        <div className="col-lg-4 col-sm-6 px-xl-4 px-3 mb-5" key={food.name}>
          <RestaurantMenuItem {...food} restaurantName={name} restaurantId={id} type="food" />
        </div>
      );
    });
  };

  render() {
    return (
      <React.Fragment>
        <div className="row restaurant__cards">{this.renderMenuItems()}</div>
        {!this.props.restaurant.menu.length && (
          <p className="u-font-size-default">لیست منو خالی می‌باشد</p>
        )}
      </React.Fragment>
    );
  }
}

export default RestaurantMenuList;
