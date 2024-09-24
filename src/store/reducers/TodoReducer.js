const initialState = {
	todoData: [],
	isLoading: false,
	isDeleting: false,
};

const setTodo = (state = initialState, action) => {
	switch (action.type) {
		case "ADD_TODO_PENDING":
			return {
				...state,
				isLoading: true,
			};

		case "ADD_TODO":
			return {
				...state,
				todoData: [...state.todoData, action.payload],
				isLoading: false,
			};

		case "ADD_TODO_ERROR":
			return {
				...state,
				isLoading: false,
			};

		case "CHECK": {
			const { id } = action.payload;
			const updatedTask = state.todoData.map((todo) =>
				todo.id === id ? { ...todo, checked: !todo.checked } : todo
			);

			return {
				...state,
				todoData: updatedTask,
			};
		}

		case "DELETE_TODO_PENDING":
			return {
				...state,
				isDeleting: true,
			};

		case "DELETE": {
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

		default:
			return state;
	}
};

export default setTodo;
