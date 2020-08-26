import {
  FoodPartiesType,
  FetchFoodPartiesAction,
  ActionTypes
} from "../../actions";

export const foodPartiesReducer = (
  state: FoodPartiesType[] = [],
  action: FetchFoodPartiesAction
) => {
  switch (action.type) {
    case ActionTypes.getFoodPartiesSuccess:
      return action.payload;
    default:
      return state;
  }
};
