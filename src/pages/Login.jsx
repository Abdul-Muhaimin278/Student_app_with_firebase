import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button, Form, FormGroup, Input, Label, Spinner } from "reactstrap";
import { login } from "../store/actions/authAction";
import { useDispatch, useSelector } from "react-redux";

const Login = () => {
	const dispatch = useDispatch();
	const { loading } = useSelector((state) => state?.auth);
	const history = useHistory();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch(
			login({ email, password }, () => {
				setEmail("");
				setPassword("");
				history.push("/todo");
			})
		);
	};

	return (
		<section className="container d-flex align-items-center justify-content-center">
			<Form className="my-5 p-3 rounded-lg login-form" onSubmit={handleSubmit}>
				<h2 className="text-center mb-5">Login</h2>

				<FormGroup>
					<Label htmlFor="email">Email:</Label>
					<Input
						type="email"
						id="email"
						placeholder="Enter Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</FormGroup>

				<FormGroup>
					<Label htmlFor="password">Password:</Label>
					<Input
						type="password"
						id="password"
						placeholder="Enter Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</FormGroup>

				<p>
					Don't have an account yet?<Link to="/signup">Sign up</Link>
				</p>
				{loading === true ? (
					<Spinner color="primary"></Spinner>
				) : (
					<Button type="submit" color="primary">
						Log in
					</Button>
				)}
			</Form>
		</section>
	);
};

export default Login;
