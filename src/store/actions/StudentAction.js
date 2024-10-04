import { toast } from "react-toastify";
import firebase, { db, storageRef } from "../../config/firebase";

//^ FETCH function
export const fetchStudents = (uid, filter, lastVisible) => async (dispatch) => {
	dispatch({
		type: "FETCH_PENDING",
	});

	try {
		const { searchName, searchRollNo, order } = filter;

		let students = [];
		let fetchRef = db
			.collection("students")
			.where("createdBy", "==", uid)
			.orderBy("createdAt", order);

		if (searchName) {
			fetchRef = fetchRef.where("name", "==", searchName);
		}
		if (searchRollNo) {
			fetchRef = fetchRef.where("rollNo", "==", searchRollNo);
		}

		if (lastVisible) {
			fetchRef = fetchRef.startAfter(lastVisible);
		}
		let lastDoc = null;
		await fetchRef
			.limit(2)
			.get()
			.then((snapshot) => {
				snapshot.forEach((doc) => {
					students.push(doc.data());
				});
				lastDoc = snapshot.docs[snapshot.docs.length - 1];
			});

		if (lastVisible) {
			dispatch({
				type: "LOAD_MORE",
				payload: { students, lastVisible: lastDoc },
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
		let imageURL = "";

		if (image) {
			const fileRef = storageRef.child(`images/${item.name}`);
			const uploadTask = fileRef.put(image);

			uploadTask.on(
				"state_changed",
				(snapshot) => {
					console.log(
						`Upload progress: ${Math.round(
							(snapshot.bytesTransferred / snapshot.totalBytes) * 100
						)}%`
					);
				},
				(error) => {
					console.error("Upload error:", error);
					toast.error("Error uploading image");
				},
				async () => {
					imageURL = await uploadTask.snapshot.ref.getDownloadURL();
					console.log("URL:", imageURL);

					toast.success("Student registered successfully");
				}
			);
		} else {
			toast.success("Student registered successfully");
		}

		console.log("image url", imageURL);

		const payload = {
			createdAt: firebase.firestore.FieldValue.serverTimestamp(),
			createdBy: uid,
			id: addDocRef.id,
			imageURL,
			...item,
		};

		await addDocRef.set(payload);

		dispatch({
			type: "ADD_STUDENT",
			payload,
		});
	} catch (error) {
		console.error(error.message);
		toast.error(error.message || "Unknown error occurred");
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
