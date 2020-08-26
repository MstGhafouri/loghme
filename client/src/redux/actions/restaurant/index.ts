import { Dispatch } from "redux";
import { ActionTypes, RestaurantsType, searchParamsType } from "../types";
import loghmeApi from "../../../api/loghmeApi";
import { handleException } from "../utility";

export interface FetchRestaurantsAction {
  type: ActionTypes.getRestaurantsSuccess;
  payload: RestaurantsType[];
}

export interface FetchRestaurantAction {
  type: ActionTypes.getRestaurantSuccess;
  payload: RestaurantsType;
}

export interface getTotalRestaurantsAction {
  type: ActionTypes.getTotalRestaurants;
  payload: number;
}

export interface setSearchParamsAction {
  type: ActionTypes.setSearchParams;
  payload: searchParamsType;
}

type fetchRestaurantsParams = {
  restaurantName?: string;
  foodName?: string;
  page?: number;
  limit?: number;
};

const INITIAL_PARAMS = {
  restaurantName: undefined,
  foodName: undefined,
  page: 1,
  limit: 16
};

export const fetchRestaurants = ({
  restaurantName,
  foodName,
  page,
  limit
}: fetchRestaurantsParams = INITIAL_PARAMS) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({ type: ActionTypes.getRestaurantsRequest });
      dispatch({ type: ActionTypes.setSearchParams, payload: { restaurantName, foodName } });

      let query = `?page=${page}&limit=${limit || 16}`;
      query += restaurantName ? `&name=${restaurantName}` : "";
      query += foodName ? `&foodName=${foodName}` : "";

      const response = await loghmeApi.get<{
        data: { restaurants: RestaurantsType[] };
        totalResults: number;
      }>(`/restaurants${query}`);

      dispatch({
        type: ActionTypes.getTotalRestaurants,
        payload: response.data.totalResults
      });

      dispatch<FetchRestaurantsAction>({
        type: ActionTypes.getRestaurantsSuccess,
        payload: response.data.data.restaurants
      });
    } catch (error) {
      dispatch({ type: ActionTypes.getRestaurantsFailure, payload: error });
      handleException(error, dispatch);
    }
  };
};

export const fetchRestaurant = (slug: string) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({ type: ActionTypes.getRestaurantRequest });

      const response = await loghmeApi.get<{ data: { restaurant: RestaurantsType } }>(
        `/restaurants/slug/${slug}`
      );
      dispatch<FetchRestaurantAction>({
        type: ActionTypes.getRestaurantSuccess,
        payload: response.data.data.restaurant
      });
    } catch (error) {
      dispatch({ type: ActionTypes.getRestaurantFailure, payload: error });
      handleException(error, dispatch, ActionTypes.getRestaurantFailure);
    }
  };
};
