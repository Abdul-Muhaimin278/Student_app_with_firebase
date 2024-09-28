import Todo from "../components/Todo";
import Login from "../pages/Login";
import SignUp from "../pages/Signup";
// import AuthView from "../views/auth/AuthView";
import MainView from "../views/MainView";

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
	{
		path: "/",
		component: MainView,
		layout: "main",
	},
	{
		path: "/todo",
		component: Todo,
		layout: "main",
	},
];
export default routes;
