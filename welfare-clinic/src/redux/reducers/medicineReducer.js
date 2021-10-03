import { ActionTypes } from "../constants/action-types";

const initialState = {
  medicines: [],
};

export const medicineReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ActionTypes.SET_MEDICINES:
      return { ...state, medicines: payload };
    default:
      return state;
  }
};
