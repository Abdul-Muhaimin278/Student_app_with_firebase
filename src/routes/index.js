// import Todo from "../components/Todo";
import Login from "../pages/Login";
import SignUp from "../pages/Signup";
import StudentRegister from "../pages/StudentsRegister";
// import AuthView from "../views/auth/AuthView";
// import MainView from "../views/MainView";

let routes = [
	{
		path: "/login",
		component: Login,
		layout: "auth",
	},
	{
		path: "/signup",
		component: SignUp,
		layout: "auth",
	},
	// {
	// 	path: "/todo",
	// 	component: Todo,
	// 	layout: "main",
	// },
	{
		path: "/students",
		component: StudentRegister,
		layout: "main",
	},
];
export default routes;
