import { StateStore } from "../index";
import { asyncActionsNameType } from "../../actions";

export type loadingReducerType = {
  [key in asyncActionsNameType]?: boolean;
};

export const loadingReducer = (state: loadingReducerType = {}, action: { type: string }) => {
  const { type } = action;
  const matches = /(.*)_(REQUEST|SUCCESS|FAILURE)/.exec(type);

  if (!matches) return state;

  const [, requestName, requestState] = matches;

  return {
    ...state,
    [requestName]: requestState === "REQUEST", // Returns true only if we are in REQUEST state
  };
};

export const createLoadingSelector = (actions: asyncActionsNameType[]) => (state: StateStore) =>
  actions.some((action: asyncActionsNameType) => state.loading[action]);
