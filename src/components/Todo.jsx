import { useState } from "react";
import { Button, Form, FormGroup, Input } from "reactstrap";

const Todo = () => {
	const [task, setTask] = useState("");
	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(task);
	};
	return (
		<>
			<section className="header-section bg-secondary p-3 rounded text-center">
				<h1>Firebase Todo App</h1>
			</section>

			<section className="form-section my-3">
				<h4 className="text-center">Add Todo</h4>
				<Form
					onSubmit={handleSubmit}
					className="d-flex  align-items-center justify-content-center"
				>
					<FormGroup className="form-input">
						<Input
							type="text"
							name="todo"
							id="todo"
							value={task}
							onChange={(e) => setTask(e.target.value)}
						/>
					</FormGroup>
					<FormGroup className="form-btn">
						<Button color="primary" type="submit">
							Add to List
						</Button>
					</FormGroup>
				</Form>
			</section>

			<section className="list-section"></section>
		</>
	);
};

export default Todo;
