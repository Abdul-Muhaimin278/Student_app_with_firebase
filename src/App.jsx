/* eslint-disable default-case */
/* eslint-disable array-callback-return */
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Auth from "./layout/Auth";
import Main from "./layout/Main";
import routes from "./routes";

const App = () => {
	return (
		<BrowserRouter>
			<Switch>
				{routes.map((route) => {
					switch (route.layout) {
						case "main":
							return (
								<Route key={route.path} exact path={route.path}>
									<Main>
										<route.component />
									</Main>
								</Route>
							);

						case "auth":
							return (
								<Route key={route.path} exact path={route.path}>
									<Auth>
										<route.component />
									</Auth>
								</Route>
							);
					}
				})}
				<Redirect to="/signup" />
			</Switch>
		</BrowserRouter>
	);
};

export default App;
