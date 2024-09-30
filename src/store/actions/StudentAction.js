import { toast } from "react-toastify";
import firebase, { db } from "../../config/firebase";

//^ FETCH function
export const fetchStudents = (uid) => async (dispatch) => {
	dispatch({
		type: "FETCH_PENDING",
	});
	try {
		let students = [];
		await db
			.collection("students")
			.where("createdBy", "==", uid)
			.orderBy("createdAt", "asc")
			.limit(8)
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					students.push(doc.data());
				});
			});

		dispatch({
			type: "FETCH",
			payload: students,
		});
	} catch (error) {
		console.error(error.message);
		toast.error(error.message || "Unknown error occurred", { autoClose: 3000 });
		dispatch({
			type: "FETCH_ERROR",
		});
	}
};

//^ ADD STUDENT function
export const addStudents = (uid, item) => async (dispatch) => {
	dispatch({
		type: "ADD_STUDENT_PENDING",
	});
	try {
		const addDocRef = db.collection("students").doc();
		const payload = {
			createdAt: firebase.firestore.FieldValue.serverTimestamp(),
			createdBy: uid,
			id: addDocRef.id,
			...item,
		};
		await addDocRef.set(payload);

		toast.success("Student registered successfully");
		dispatch({
			type: "ADD_STUDENT",
			payload,
		});
	} catch (error) {
		toast.error(error.message || "Unknown error occurred", { autoClose: 3000 });
		dispatch({
			type: "ADD_STUDENT_ERROR",
		});
	}
};

//^ DELETE TODO function

export const delStudent = (id) => async (dispatch) => {
	dispatch({
		type: "DELETE_STUDENT_PENDING",
	});
	try {
		await db.collection("students").doc(id).delete();
		toast.success("Todo deleted successfully");
		dispatch({
			type: "DELETE_STUDENT",
			payload: { id },
		});
	} catch (error) {
		toast.error(error.message || "Unknown error occurred", { autoClose: 3000 });
		dispatch({
			type: "DELETE_STUDENT_ERROR",
		});
	}
};

//^ EDIT STUDENT

export const editStudent = (item) => async (dispatch) => {
	const { id, name, age, rollNo } = item;
	dispatch({
		type: "EDIT_STUDENT_PENDING",
	});
	try {
		let taskRef = db.collection("students").doc(id);

		await taskRef.update({
			name,
			age,
			rollNo,
		});

		toast.success("Todo edited successfully");
		dispatch({
			type: "EDIT_STUDENT",
			payload: item,
		});
	} catch (error) {
		toast.error(error.message || "Unknown error occurred", {
			autoClose: 3000,
		});
		dispatch({
			type: "EDIT_STUDENT_ERROR",
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
