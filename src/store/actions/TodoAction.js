import { toast } from "react-toastify";
import firebase from "../../config/firebase";

export const addTodo = (uid, item) => async (dispatch) => {
	dispatch({
		type: "ADD_TODO_PENDING",
	});
	try {
		const payload = {
			createdAt: firebase.firestore.FieldValue.serverTimestamp(),
			createdBy: uid,
			...item,
		};
		await firebase.firestore().collection("todos").doc(item.id).set(payload);
		toast.success("Todo added successfully");
		dispatch({
			type: "ADD_TODO",
			payload: item,
		});
	} catch (error) {
		toast.error(error.message || "Unknown error occurred");
		dispatch({
			type: "ADD_TODO_ERROR",
		});
	}
};

export const checkTodo = (id) => (dispatch) => {
	dispatch({
		type: "CHECK",
		payload: { id },
	});
};

export const delTodo = (id) => async (dispatch) => {
	dispatch({
		type: "DELETE_TODO_PENDING",
	});
	try {
		await firebase.firestore().collection("todos").doc(id).delete();
		toast.success("Todo deleted successfully");
		dispatch({
			type: "DELETE",
			payload: { id },
		});
	} catch (error) {
		toast.error(error.message || "Unknown error occurred");
		dispatch({
			type: "DELETE_TODO_ERROR",
		});
	}
};
