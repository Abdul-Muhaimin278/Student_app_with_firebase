//^ Root Reducer

import { combineReducers } from "redux";
import setTodo from "./TodoReducer";
import authReducer from "./authReducer";

export const rootReducer = combineReducers({
	auth: authReducer,
	todo: setTodo,
});

export default rootReducer;
