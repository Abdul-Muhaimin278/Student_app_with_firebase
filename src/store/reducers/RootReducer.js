// Root Reducer

import { combineReducers } from "redux";
import authUserReducer from "./authUser";
import setTodo from "./TodoReducer";

export const rootReducer = combineReducers({
	authUser: authUserReducer,
	todo: setTodo,
});

export default rootReducer;
