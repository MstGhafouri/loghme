import { StopTimerAction, ActionTypes } from "../../actions";
import { StartTimerAction, ResetTimerAction } from "./../../actions/timer/index";

const INITIAL_STATE = {
  startedAt: undefined,
  stoppedAt: undefined
};

export interface TimerStateType {
  stoppedAt: number | undefined;
  startedAt: number | undefined;
}

export type TimerActionsType = StopTimerAction | StartTimerAction | ResetTimerAction;

export const TimerReducer = (state: TimerStateType = INITIAL_STATE, action: TimerActionsType) => {
  switch (action.type) {
    case ActionTypes.resetTimer:
      return {
        ...state,
        startedAt: state.startedAt ? action.payload : undefined,
        stoppedAt: state.stoppedAt ? action.payload : undefined
      };
    case ActionTypes.startTimer:
      return {
        ...state,
        startedAt: action.payload,
        stoppedAt: undefined
      };
    case ActionTypes.stopTimer:
      return {
        ...state,
        stoppedAt: action.payload
      };
    default:
      return state;
  }
};
