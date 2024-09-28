import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { Button, Form, FormGroup, Input, Label, Spinner } from "reactstrap";
import { SignUpAction } from "../store/actions/authAction";

const SignUp = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const { loading } = useSelector((state) => state.auth);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [userName, setUserName] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch(
			SignUpAction({ email, password, userName }, () => {
				setEmail("");
				setPassword("");
				setUserName("");
				history.push("/todo");
			})
		);
	};

	return (
		<section className="container d-flex align-items-center justify-content-center">
			<Form className="my-5 p-3 rounded-lg signup-form" onSubmit={handleSubmit}>
				<h2 className="text-center mb-5">Sign Up</h2>

				<FormGroup>
					<Label htmlFor="Username">Username:</Label>
					<Input
						type="Username"
						id="Username"
						placeholder="Enter Username"
						value={userName}
						onChange={(e) => setUserName(e.target.value)}
					/>
				</FormGroup>

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
					Already have an account.<Link to="/login">Login</Link>
				</p>
				<Button type="submit" color="primary">
					{loading ? <Spinner color="white" size="sm"></Spinner> : <>Sign up</>}
				</Button>
			</Form>
		</section>
	);
};

export default SignUp;
