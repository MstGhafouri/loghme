import { RestaurantsType, FetchRestaurantAction, ActionTypes } from "../../actions";

export const restaurantReducer = (
  state: RestaurantsType = {} as RestaurantsType,
  action: FetchRestaurantAction
) => {
  switch (action.type) {
    case ActionTypes.getRestaurantSuccess:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
