import { asyncActionsNameType } from "../../actions";
import { StateStore } from "..";

export type errorReducerType = {
  [key in asyncActionsNameType]?: { message: string; statusCode: number };
};

export const errorReducer = (
  state: errorReducerType = {},
  action: { type: string; payload?: any }
) => {
  const { type, payload } = action;
  const matches = /(.*)_(REQUEST|FAILURE)/.exec(type);

  if (!matches) return state;

  const [, requestName, requestState] = matches;

  return {
    ...state,
    [requestName]:
      requestState === "FAILURE"
        ? { message: payload.message, statusCode: payload.response && payload.response.status }
        : {},
  };
};

export const createErrorMessageSelector = (actions: asyncActionsNameType[]) => (state: StateStore) => {
  const errors = actions.map((action: asyncActionsNameType) => state.error[action]);
  return errors && errors[0] ? errors[0] : "";
};
