//^ Root Reducer

import { combineReducers } from "redux";
import setTodo from "./TodoReducer";
import authReducer from "./authReducer";
import setStudents from "./StudentReducer";

export const rootReducer = combineReducers({
	auth: authReducer,
	todo: setTodo,
	student: setStudents,
});

export default rootReducer;
