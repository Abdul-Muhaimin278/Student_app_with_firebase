const initialState = {
	userData: null,
	loading: false,
	uid: null,
};

const authReducer = (state = initialState, action) => {
	switch (action.type) {
		case "USER_SIGNUP_PENDING":
			return {
				...state,
				loading: true,
			};

		case "USER_SIGNUP":
			return {
				...state,
				userData: action.payload,
				loading: false,
			};

		case "USER_SIGNUP_ERROR":
			return {
				...state,
				loading: false,
			};

		case "USER_LOGIN_PENDING":
			return {
				...state,
				loading: true,
			};

		case "USER_LOGIN":
			return {
				...state,
				userData: action.payload,
				loading: false,
			};

		case "USER_LOGIN_ERROR":
			return {
				...state,
				loading: false,
			};

		default:
			return { ...state };
	}
};

export default authReducer;
