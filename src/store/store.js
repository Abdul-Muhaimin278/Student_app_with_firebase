import { applyMiddleware, compose, createStore } from "redux";
import rootReducer from "./reducers/RootReducer";
import thunk from "redux-thunk";
import CryptoJS from "crypto-js";

const saveToLocalStorage = (state) => {
	const serializedUid = CryptoJS.AES.encrypt(
		JSON.stringify(state.auth),
		"my-secret-key"
	).toString();
	console.log(serializedUid);
	localStorage.setItem("auth", serializedUid);
};

const checkLocalStorage = () => {
	const serializedUid = localStorage.getItem("auth");
	if (serializedUid === null) return undefined;
	return {
		auth: JSON.parse(
			CryptoJS.AES.decrypt(serializedUid, "my-secret-key").toString(
				CryptoJS.enc.Utf8
			)
		),
	};
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
	rootReducer,
	checkLocalStorage(),
	composeEnhancers(applyMiddleware(thunk))
);

store.subscribe(() => saveToLocalStorage(store.getState()));
export default store;
