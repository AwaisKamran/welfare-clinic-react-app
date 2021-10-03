import { combineReducers } from "redux";
import { medicineReducer } from "./medicineReducer";

const reducers = combineReducers({
  medicines: medicineReducer,
});

export default reducers;
