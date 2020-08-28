import { Dispatch } from "redux";
import { displayConditionalToast } from "../../util";
import { Orders, FoodPartiesType, ActionTypes } from "./types";
import { FetchFoodPartiesAction, setCurrentUser } from ".";
import history from "../../history";
import loghmeApi from "../../api/loghmeApi";

export const handleException = (err: any, dispatch: Dispatch, type: string = "") => {
  if (err.response) {
    const {
      status,
      data: { message }
    } = err.response;
    displayConditionalToast(status, message);
    if (status === 401) dispatch(setCurrentUser(null));
    else if (status === 404 && type === ActionTypes.getRestaurantFailure) history.push("/404");
  }
};

export const handleFoodPartyCartItem = async (
  { cartItems: selectedItems }: Orders,
  dispatch: Dispatch
) => {
  const hasFoodParty = selectedItems.find(item => item.type === "foodParty");

  if (hasFoodParty) {
    const response = await loghmeApi.get<{ data: { restaurants: FoodPartiesType[] } }>(
      "/restaurants/food-parties?isUpdated=1"
    );
    dispatch<FetchFoodPartiesAction>({
      type: ActionTypes.getFoodPartiesSuccess,
      payload: response.data.data.restaurants
    });
  }
};
