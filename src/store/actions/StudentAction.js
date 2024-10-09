import { toast } from "react-toastify";
import firebase, { db, storageRef } from "../../config/firebase";

//^ FETCH function
export const fetchStudents = (uid, filter, lastVisible) => async (dispatch) => {
	try {
		const limit = 10;
		let students = [];
		let fetchRef = db
			.collection("students")
			.where("createdBy", "==", uid)
			.orderBy("createdAt", filter?.order);

		if (filter?.searchName) {
			fetchRef = fetchRef.where("name", "==", filter?.searchName);
		}
		if (filter?.searchRollNo) {
			fetchRef = fetchRef.where("rollNo", "==", filter?.searchRollNo);
		}

		if (lastVisible) {
			fetchRef = fetchRef.startAfter(lastVisible);
		}
		let lastDoc = null;
		let hasMore = true;
		await fetchRef
			.limit(limit)
			.get()
			.then((snapshot) => {
				snapshot.forEach((doc) => {
					students.push(doc.data());
				});
				lastDoc = snapshot.docs[snapshot.docs.length - 1];
				hasMore = snapshot.docs.length >= limit;
			});

		if (lastVisible) {
			dispatch({
				type: "LOAD_MORE",
				payload: { students, hasMore, lastVisible: lastDoc },
			});
		} else {
			dispatch({
				type: "FETCH",
				payload: { students, hasMore, lastVisible: lastDoc },
			});
		}
	} catch (error) {
		console.error(error.message);
		toast.error(error.message || "Unknown error occurred", { autoClose: 3000 });
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
			rollNo = String(Number(Object.values(doc.data())) + 1);
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
						resolve();
					}
				);
			});
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
		toast.success("Student registered successfully");

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

export const editStudent = (item, image) => async (dispatch) => {
	const { id } = item;
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
						toast.error("Error uploading image", { autoClose: 3000 });
						reject(error);
					},
					async () => {
						newImageURL = await uploadTask.snapshot.ref.getDownloadURL();
						resolve();
					}
				);
			});
		}

		const payload = {
			...item,
			...(newImageURL && { imageURL: newImageURL }),
		};

		await taskRef.update(payload);

		toast.success("Student edited successfully");
		dispatch({
			type: "EDIT_STUDENT",
			payload,
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
