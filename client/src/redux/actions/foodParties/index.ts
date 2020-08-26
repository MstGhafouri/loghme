import { Dispatch } from "redux";
import { ActionTypes, FoodPartiesType } from "../types";
import { handleException } from "../utility";
import loghmeApi from "../../../api/loghmeApi";
import { startTimer } from "../timer";

export interface FetchFoodPartiesAction {
  type: ActionTypes.getFoodPartiesSuccess;
  payload: FoodPartiesType[];
}

export const fetchFoodParties = () => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: ActionTypes.getFoodPartiesRequest });

    const foodPartyResponse = await loghmeApi.get<{ data: FoodPartiesType[] }>("/food-parties");
    const startTimeResponse = await loghmeApi.get<{ data: number }>("/remaining-time");

    dispatch<FetchFoodPartiesAction>({
      type: ActionTypes.getFoodPartiesSuccess,
      payload: foodPartyResponse.data.data
    });
    dispatch(startTimer(startTimeResponse.data.data));
  } catch (err) {
    dispatch({ type: ActionTypes.getFoodPartiesFailure, payload: err });
    handleException(err, dispatch);
  }
};
