import React from "react";
import { connect } from "react-redux";
import { fetchFoodParties, FoodPartiesType } from "../../../../redux/actions";
import { StateStore } from "../../../../redux/reducers";
import { createLoadingSelector } from "../../../../redux/reducers/loading";
import Carousel from "./Carousel";
import FoodPartyItem from "./FoodPartyItem";
import Loader from "../../../Loader";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export interface FoodPartyListProps {
  fetchFoodParties: Function;
  foodParties: FoodPartiesType[];
  isFetching: boolean;
  stoppedAt: number | undefined;
}

class FoodPartyList extends React.Component<FoodPartyListProps> {
  componentDidMount() {
    // this.props.fetchFoodParties();
  }

  componentDidUpdate() {
    if (this.props.stoppedAt) {
      // this.props.fetchFoodParties();
    }
  }

  shouldComponentUpdate(nextProps: FoodPartyListProps) {
    return nextProps.foodParties !== this.props.foodParties || nextProps.stoppedAt !== undefined;
  }

  renderFoodParties = (): JSX.Element | JSX.Element[] => {
    const { foodParties } = this.props;
    let results: JSX.Element[] = [];

    foodParties.forEach(restaurant => {
      restaurant.menu.forEach((food, i) => {
        results.push(
          <FoodPartyItem
            key={food.name}
            restaurantName={restaurant.name}
            restaurantId={restaurant.id}
            {...food}
          />
        );
      });
    });
    return results;
  };

  render() {
    const { foodParties, isFetching } = this.props;
    return (
      <div id="foodParty-carousel" style={{ position: "relative" }}>
        <Carousel length={foodParties.length}>{this.renderFoodParties()}</Carousel>
        <Loader loading={isFetching} />
      </div>
    );
  }
}

type foodPartyStateType = {
  foodParties: FoodPartiesType[];
  isFetching: boolean;
  stoppedAt: number | undefined;
};

const loadingSelector = createLoadingSelector(["GET_FOOD_PARTIES"]);

const mapStateToProps = (state: StateStore): foodPartyStateType => {
  const {
    foodParties,
    timer: { stoppedAt }
  } = state;
  return { foodParties, isFetching: loadingSelector(state), stoppedAt };
};

export default connect(mapStateToProps, { fetchFoodParties })(FoodPartyList);
