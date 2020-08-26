import { combineReducers } from "redux";
import { reducer as formReducer, FormStateMap } from "redux-form";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import {
  restaurantsReducer,
  getTotalRestaurantsReducer,
  setSearchParamsReducer
} from "./restaurant/restaurantsReducer";
import { restaurantReducer } from "./restaurant/restaurantReducer";
import { foodPartiesReducer } from "./foodParties/foodPartiesReducer";
import { RestaurantsType, FoodPartiesType, searchParamsType } from "../actions";
import { handleModalsReducer } from "./ui/handleModalsReducer";
import { userReducer, UserStateType } from "./user/userReducer";
import { cartReducer, CartType } from "./cart/index";
import { TimerReducer, TimerStateType } from "./timer/timerReducer";
import { loadingReducer, loadingReducerType } from "./loading/index";
import { errorReducer, errorReducerType } from "./error/errorReducer";

export interface StateStore {
  user: UserStateType;
  cart: CartType;
  restaurants: RestaurantsType[];
  totalRestaurants: number;
  searchParams: searchParamsType;
  restaurant: RestaurantsType;
  foodParties: FoodPartiesType[];
  clickedModal: { open: boolean; name: string };
  timer: TimerStateType;
  loading: loadingReducerType;
  error: errorReducerType;
  form: FormStateMap;
}

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "user"]
};

const rootReducer = combineReducers<StateStore>({
  user: userReducer,
  cart: cartReducer,
  restaurants: restaurantsReducer,
  totalRestaurants: getTotalRestaurantsReducer,
  searchParams: setSearchParamsReducer,
  restaurant: restaurantReducer,
  foodParties: foodPartiesReducer,
  clickedModal: handleModalsReducer,
  timer: TimerReducer,
  loading: loadingReducer,
  error: errorReducer,
  form: formReducer
});

export default persistReducer(persistConfig, rootReducer);
