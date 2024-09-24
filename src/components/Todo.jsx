import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Card, Form, FormGroup, Input } from "reactstrap";
import { addTodo, checkTodo, delTodo } from "../store/actions/TodoAction";
import { useSelector } from "react-redux";
import { MdDeleteForever } from "react-icons/md";
import "./Todo.css";

const Todo = () => {
	const [task, setTask] = useState("");
	const [delId, setDelId] = useState("");

	const dispatch = useDispatch();
	const todoData = useSelector((state) => state.todo.todoData);
	const loading = useSelector((state) => state.todo.isLoading);
	const deleting = useSelector((state) => state.todo.isDeleting);

	const generateId = () => {
		const characters = "Walter-Hartwell-White-aka-Heisenberg";
		console.log(characters.length);

		let id = "";

		for (let i = 0; i < 12; i++) {
			id += characters[Math.floor(Math.random() * 36)];
		}
		return id;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		let id = generateId();
		let uid = localStorage.getItem("auth");
		const todo = {
			id,
			task,
			checked: false,
		};
		dispatch(addTodo(uid, todo)).then(() => {
			setTask("");
		});
	};

	const handleCheckTodo = (id) => {
		dispatch(checkTodo(id));
	};

	const handleDeleteTodo = (id) => {
		setDelId(id);
		dispatch(delTodo(id));
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
					className="d-flex align-items-center justify-content-center "
				>
					<FormGroup className="form-input">
						<Input
							required
							id="todo"
							type="text"
							name="todo"
							value={task}
							autoComplete="off"
							onChange={(e) => setTask(e.target.value)}
						/>
					</FormGroup>

					<FormGroup className="form-btn ml-3">
						<Button color="primary" type="submit" disabled={loading}>
							{!loading ? (
								"Add to List"
							) : (
								<>
									<span
										class="spinner-border spinner-border-sm"
										aria-hidden="true"
									></span>
									<span class="visually-hidden" role="status"></span>
								</>
							)}
						</Button>
					</FormGroup>
				</Form>
			</section>

			<section className="list-section text-capitalize container">
				{todoData.map((todo) => {
					return (
						<Card
							className="d-flex flex-row justify-content-between align-items-center my-3 py-2 px-5 mx-auto card"
							key={todo.id}
						>
							<Input type="checkbox" onClick={() => handleCheckTodo(todo.id)} />
							<label
								className={`m-0 ${todo.checked ? "checked" : "notChecked"}`}
							>
								{todo.task}
							</label>
							<Button
								color="danger"
								className="btn-sm"
								onClick={() => handleDeleteTodo(todo.id)}
								disabled={deleting}
							>
								{deleting && todo.id === delId ? (
									<>
										<span
											class="spinner-border spinner-border-sm"
											aria-hidden="true"
										></span>
										<span class="visually-hidden" role="status"></span>
									</>
								) : (
									<MdDeleteForever />
								)}
							</Button>
						</Card>
					);
				})}
			</section>
		</>
	);
};

export default Todo;
