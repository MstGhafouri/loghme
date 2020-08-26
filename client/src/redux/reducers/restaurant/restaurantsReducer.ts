import {
  RestaurantsType,
  FetchRestaurantsAction,
  ActionTypes,
  getTotalRestaurantsAction,
  searchParamsType,
  setSearchParamsAction
} from "../../actions";

export const restaurantsReducer = (
  state: RestaurantsType[] = [],
  action: FetchRestaurantsAction
) => {
  switch (action.type) {
    case ActionTypes.getRestaurantsSuccess:
      return action.payload;
    default:
      return state;
  }
};

export const getTotalRestaurantsReducer = (
  state: number = 0,
  action: getTotalRestaurantsAction
) => {
  switch (action.type) {
    case ActionTypes.getTotalRestaurants:
      return action.payload;
    default:
      return state;
  }
};

export const setSearchParamsReducer = (
  state: searchParamsType = {},
  action: setSearchParamsAction
) => {
  switch (action.type) {
    case ActionTypes.setSearchParams:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
