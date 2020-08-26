import { ActionTypes } from "../types";

export interface HandleModalsAction {
  type: ActionTypes.handleModals;
  payload: { open: boolean; name: string };
}

export const handleModals = (open: boolean, name: string): HandleModalsAction => {
  return {
    type: ActionTypes.handleModals,
    payload: { open, name }
  };
};
