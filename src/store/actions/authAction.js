import { toast } from "react-toastify";
import firebase, { auth, db } from "../../config/firebase";

export const SignUpAction = (item, onSuccess) => async (dispatch) => {
	const { email, password } = item;
	dispatch({
		type: "USER_SIGNUP_PENDING",
	});

	try {
		const userCredentials = await auth.createUserWithEmailAndPassword(
			email,
			password
		);
		const uid = userCredentials.user.uid;

		const payload = {
			createdAt: firebase.firestore.FieldValue.serverTimestamp(),
			uid: uid,
			...item,
		};
		await db.collection("users").doc(uid).set(payload);
		toast.success("Sign up successfully");
		dispatch({
			type: "USER_SIGNUP",
			payload,
		});
		onSuccess();
	} catch (error) {
		toast.error(error.message || "unknown error occurred", { autoClose: 3000 });
		dispatch({
			type: "USER_SIGNUP_ERROR",
		});
	}
};

export const login = (item) => async (dispatch) => {
	const { email, password } = item;

	dispatch({
		type: "USER_LOGIN_PENDING",
	});

	try {
		await auth.signInWithEmailAndPassword(email, password);
		dispatch({
			type: "USER_LOGIN",
			payload: item,
		});
	} catch (error) {
		toast.error(error.message || "unknown error occurred", { autoClose: 3000 });
		dispatch({
			type: "USER_LOGIN_ERROR",
		});
	}
};

export const logout = () => async (dispatch) => {
	dispatch({
		type: "LOGOUT",
	});
};
