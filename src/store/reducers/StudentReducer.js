const initialState = {
	studentsData: [],
	lastVisible: null,
	loader: false,
	isAdding: false,
	isDeleting: false,
	isUpdating: false,
	applyingFilter: false,
	toggleBtn: null,
};

const setStudents = (state = initialState, action) => {
	switch (action.type) {
		case "FETCH_PENDING":
			return { ...state, loader: true, applyingFilter: true };

		case "FETCH": {
			const { students, lastVisible } = action.payload;
			console.log(lastVisible);

			return {
				...state,
				studentsData: students,
				lastVisible,

				loader: false,
				applyingFilter: false,
			};
		}

		case "LOAD_MORE": {
			const { students, lastVisible } = action.payload;
			console.log(lastVisible);

			return {
				...state,
				studentsData: [...state.studentsData, ...students],
				lastVisible,
			};
		}

		case "FETCH_ERROR":
			return { ...state, loader: false, applyingFilter: false };

		case "ADD_STUDENT_PENDING":
			return {
				...state,
				isAdding: true,
			};

		case "ADD_STUDENT":
			return {
				...state,
				studentsData: [...state.studentsData, action.payload],
				isAdding: false,
			};

		case "ADD_STUDENT_ERROR":
			return {
				...state,
				isAdding: false,
			};

		case "DELETE_STUDENT_PENDING":
			return {
				...state,
				isDeleting: true,
			};

		case "DELETE_STUDENT": {
			console.log(state.studentsData);

			const { id } = action.payload;
			const editStudent = state.studentsData.filter(
				(student) => student.id !== id
			);
			return {
				...state,
				studentsData: editStudent,
				isDeleting: false,
			};
		}

		case "DELETE_STUDENT_ERROR":
			return {
				...state,
				deleting: false,
			};

		case "EDIT_STUDENT_PENDING":
			return {
				...state,
				isUpdating: true,
			};

		case "EDIT_STUDENT": {
			const { id } = action.payload;

			const updatedTask = state.studentsData.map((todo) =>
				todo.id === id ? { ...action.payload } : todo
			);
			return {
				...state,
				studentsData: updatedTask,
				isUpdating: false,
				toggleBtn: null,
			};
		}

		case "EDIT_STUDENT_ERROR":
			return {
				...state,
				isUpdating: false,
			};

		case "TOGGLE":
			return {
				...state,
				toggleBtn: action.payload,
			};

		default:
			return state;
	}
};

export default setStudents;
