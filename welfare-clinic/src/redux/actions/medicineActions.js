import { ActionTypes } from "../constants/action-types";

export const setMedicines = (medicines) => {
  return {
    type: ActionTypes.SET_MEDICINES,
    payload: medicines,
  };
};
