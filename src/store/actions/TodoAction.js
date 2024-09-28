import { toast } from "react-toastify";
import firebase, { db } from "../../config/firebase";

//^ FETCH function
export const fetchTodos = () => async (dispatch) => {
	dispatch({
		type: "FETCH_PENDING",
	});
	try {
		let todos = [];
		await db
			.collection("todos")
			.orderBy("createBy", "desc")
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					todos.push(doc.data());
				});
			});

		dispatch({
			type: "FETCH",
			payload: todos,
		});
	} catch (error) {
		toast.error(error.message || "Unknown error occurred", { autoClose: 3000 });
		dispatch({
			type: "FETCH_ERROR",
		});
	}
};

//^ ADD TODO function
export const addTodo = (uid, item) => async (dispatch) => {
	dispatch({
		type: "ADD_TODO_PENDING",
	});
	try {
		console.log("id", uid);
		const addDocRef = db.collection("todos").doc();
		const payload = {
			createdAt: firebase.firestore.FieldValue.serverTimestamp(),
			createdBy: uid,
			id: addDocRef.id,
			...item,
		};
		await addDocRef.set(payload);

		toast.success("Todo added successfully");
		dispatch({
			type: "ADD_TODO",
			payload,
		});
	} catch (error) {
		toast.error(error.message || "Unknown error occurred", { autoClose: 3000 });
		dispatch({
			type: "ADD_TODO_ERROR",
		});
	}
};

//^ CHECK TODO function

export const checkTodo = (id, checked) => async (dispatch) => {
	dispatch({
		type: "CHECK_TODO_PENDING",
	});
	try {
		let taskRef = db.collection("todos").doc(id);
		await taskRef.update({
			checked: !checked,
		});
		toast.success("Checked successfully");
		dispatch({
			type: "CHECK_TODO",
			payload: { id },
		});
	} catch (error) {
		toast.error(error.message || "unknown error occurred", { autoClose: 3000 });
		dispatch({
			type: "CHECK_TODO_ERROR",
		});
	}
};

//^ DELETE TODO function

export const delTodo = (id) => async (dispatch) => {
	dispatch({
		type: "DELETE_TODO_PENDING",
	});
	try {
		await db.collection("todos").doc(id).delete();
		toast.success("Todo deleted successfully");
		dispatch({
			type: "DELETE_TODO",
			payload: { id },
		});
	} catch (error) {
		toast.error(error.message || "Unknown error occurred", { autoClose: 3000 });
		dispatch({
			type: "DELETE_TODO_ERROR",
		});
	}
};

//^ EDIT TODO

export const editTodo =
	({ value, id }) =>
	async (dispatch) => {
		dispatch({
			type: "EDIT_TODO_PENDING",
		});
		try {
			let taskRef = db.collection("todos").doc(id);

			await taskRef.update({
				task: value,
			});

			toast.success("Todo edited successfully");
			dispatch({
				type: "EDIT_TODO",
				payload: { value, id },
			});
		} catch (error) {
			toast.error(error.message || "Unknown error occurred", {
				autoClose: 3000,
			});
			dispatch({
				type: "EDIT_TODO_ERROR",
			});
		}
	};

//^ setting ToggleEdit

export const toggleEdit = (value) => (dispatch) => {
	dispatch({
		type: "TOGGLE",
		payload: value,
	});
};
