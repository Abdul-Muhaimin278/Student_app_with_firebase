import { Todo } from "../components/Todo/todo";
import AuthView from "../views/auth/AuthView";
import MainView from "../views/MainView";

let routes = [
	{
		path: "/auth",
		component: AuthView,
		layout: "auth",
	},
	{
		path: "/",
		component: MainView,
		Element: <Todo />,
		layout: "main",
	},
];
export default routes;
