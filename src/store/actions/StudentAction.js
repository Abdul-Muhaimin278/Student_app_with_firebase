import { toast } from "react-toastify";
import firebase, { db, storageRef } from "../../config/firebase";

//^ FETCH function
export const fetchStudents = (uid, filter, lastVisible) => async (dispatch) => {
	dispatch({
		type: "FETCH_PENDING",
	});

	try {
		let students = [];
		let fetchRef = db
			.collection("students")
			.where("createdBy", "==", uid)
			.orderBy("createdAt", filter?.order);

		if (filter?.searchName) {
			fetchRef = fetchRef.where("name", "==", filter?.searchName);
		}
		if (filter?.searchRollNo) {
			fetchRef = fetchRef.where("rollNo", "==", Number(filter?.searchRollNo));
		}

		if (lastVisible) {
			fetchRef = fetchRef.startAfter(lastVisible);
		}
		let lastDoc = null;
		let hasMore = null;
		await fetchRef
			.limit(2)
			.get()
			.then((snapshot) => {
				snapshot.forEach((doc) => {
					students.push(doc.data());
				});
				lastDoc = snapshot.docs[snapshot.docs.length - 1];
				hasMore = snapshot.docs.length;
			});

		if (lastVisible) {
			dispatch({
				type: "LOAD_MORE",
				payload: { students, hasMore, lastVisible: lastDoc },
			});
		} else {
			dispatch({
				type: "FETCH",
				payload: { students, lastVisible: lastDoc },
			});
		}
	} catch (error) {
		console.error(error.message);
		toast.error(error.message || "Unknown error occurred", { autoClose: 3000 });
		dispatch({
			type: "FETCH_ERROR",
		});
	}
};

//^ ADD STUDENT function

export const addStudents = (uid, image, item) => async (dispatch) => {
	dispatch({
		type: "ADD_STUDENT_PENDING",
	});

	try {
		const addDocRef = db.collection("students").doc();
		const rollNoRef = db.collection("stats").doc("rollNo");
		let rollNo = "";
		await rollNoRef.get().then((doc) => {
			rollNo = Number(Object.values(doc.data())) + 1;
		});

		let imageURL = "";

		if (image) {
			const fileRef = storageRef.child(`images/${item.name}`);
			const uploadTask = fileRef.put(image);

			await new Promise((resolve, reject) => {
				uploadTask.on(
					"state_changed",
					(snapshot) => {},
					(error) => {
						console.error("Upload error:", error);
						toast.error("Error uploading image", { autoClose: 3000 });
						reject(error);
					},
					async () => {
						imageURL = await uploadTask.snapshot.ref.getDownloadURL();
						toast.success("Student registered successfully");
						resolve();
					}
				);
			});
		} else {
			toast.success("Student registered successfully");
		}

		const payload = {
			createdAt: firebase.firestore.FieldValue.serverTimestamp(),
			createdBy: uid,
			id: addDocRef.id,
			imageURL,
			rollNo,
			...item,
		};

		await addDocRef.set(payload);
		await rollNoRef.set({ rollNo });

		dispatch({
			type: "ADD_STUDENT",
			payload,
		});
	} catch (error) {
		console.error(error.message);
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

//^ EDIT STUDENT function

export const editStudent = (item) => async (dispatch) => {
	const { id, name, age, rollNo, image } = item;
	dispatch({
		type: "EDIT_STUDENT_PENDING",
	});

	try {
		let taskRef = db.collection("students").doc(id);
		let newImageURL = "";

		if (image) {
			const fileRef = storageRef.child(`images/${item.name}`);
			const uploadTask = fileRef.put(image);

			await new Promise((resolve, reject) => {
				uploadTask.on(
					"state_changed",
					(snapshot) => {},
					(error) => {
						console.error("Upload error:", error);
						toast.error("Error uploading image", { autoClose: 3000 });
						reject(error);
					},
					async () => {
						newImageURL = await uploadTask.snapshot.ref.getDownloadURL();
						resolve();
					}
				);
			});

			await taskRef.update({
				name,
				age,
				rollNo,
				imageURL: newImageURL,
			});
		} else {
			await taskRef.update({
				name,
				age,
				rollNo,
			});
		}

		const payload = {
			editedAt: firebase.firestore.FieldValue.serverTimestamp(),
			imageURL: newImageURL,
			...item,
		};

		toast.success("Student edited successfully");
		dispatch({
			type: "EDIT_STUDENT",
			payload: payload,
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
