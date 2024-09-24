const initialState = {
	todoData: [],
	loader: false,
	isAdding: false,
	isDeleting: false,
	isUpdating: false,
	isChecked: false,
	toggleBtn: null,
};

const setTodo = (state = initialState, action) => {
	switch (action.type) {
		case "FETCH_PENDING":
			return { ...state, loader: true };

		case "FETCH":
			return { ...state, todoData: action.payload, loader: false };

		case "FETCH_ERROR":
			return { ...state, loader: false };

		case "ADD_TODO_PENDING":
			return {
				...state,
				isAdding: true,
			};

		case "ADD_TODO":
			return {
				...state,
				todoData: [action.payload, ...state.todoData],
				isAdding: false,
			};

		case "ADD_TODO_ERROR":
			return {
				...state,
				isAdding: false,
			};

		case "CHECK_TODO_PENDING":
			return {
				...state,
				isChecked: true,
			};

		case "CHECK_TODO": {
			const { id } = action.payload;
			const updatedTask = state.todoData.map((todo) =>
				todo.id === id ? { ...todo, checked: !todo.checked } : todo
			);

			return {
				...state,
				todoData: updatedTask,
				isChecked: false,
			};
		}
		case "CHECK_TODO_ERROR":
			return {
				...state,
				isChecked: false,
			};

		case "DELETE_TODO_PENDING":
			return {
				...state,
				isDeleting: true,
			};

		case "DELETE_TODO": {
			const { id } = action.payload;
			const updatedTodo = state.todoData.filter((todo) => todo.id !== id);
			return {
				...state,
				todoData: updatedTodo,
				isDeleting: false,
			};
		}

		case "DELETE_TODO_ERROR":
			return {
				...state,
				deleting: false,
			};

		case "EDIT_TODO_PENDING":
			return {
				...state,
				isUpdating: true,
			};

		case "EDIT_TODO": {
			const { value, id } = action.payload;

			const updatedTask = state.todoData.map((todo) =>
				todo.id === id ? { ...todo, task: value } : todo
			);
			return {
				...state,
				todoData: updatedTask,
				isUpdating: false,
				toggleBtn: null,
			};
		}

		case "EDIT_TODO_ERROR":
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

export default setTodo;
