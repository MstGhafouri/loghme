import { HandleModalsAction, ActionTypes } from "../../actions";

const INIT_STATE = {
  open: false,
  name: ""
};

export const handleModalsReducer = (
  state: { open: boolean; name: string } = INIT_STATE,
  action: HandleModalsAction
) => {
  switch (action.type) {
    case ActionTypes.handleModals:
      return { ...action.payload };
    default:
      return state;
  }
};
