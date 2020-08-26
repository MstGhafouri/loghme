import React from "react";
import CardItem from "./CardItem";
import { RestaurantsType } from "../../../../redux/actions/types";

export interface CardListProps {
  restaurants: RestaurantsType[];
}

const CardList: React.SFC<CardListProps> = props => {
  return (
    <div className="container">
      <div className="row">
        {props.restaurants.map(restaurant => (
          <CardItem key={restaurant.id} {...restaurant} />
        ))}
      </div>
    </div>
  );
};

export default CardList;
