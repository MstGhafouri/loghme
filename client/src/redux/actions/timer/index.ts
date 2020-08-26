import { ActionTypes } from "../types";

export interface StartTimerAction {
  type: ActionTypes.startTimer;
  payload: number;
}

export interface StopTimerAction {
  type: ActionTypes.stopTimer;
  payload: number;
}

export interface ResetTimerAction {
  type: ActionTypes.resetTimer;
  payload: number;
}

export const startTimer = (date: number): StartTimerAction => {
  return {
    type: ActionTypes.startTimer,
    payload: date
  };
};

export const stopTimer = (): StopTimerAction => {
  return {
    type: ActionTypes.stopTimer,
    payload: new Date().getTime()
  };
};

export const resetTimer = (): ResetTimerAction => {
  return {
    type: ActionTypes.resetTimer,
    payload: new Date().getTime()
  };
};
