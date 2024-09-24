import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Card, CardBody, Form, FormGroup, Input } from "reactstrap";
import {
	addTodo,
	checkTodo,
	delTodo,
	editTodo,
	fetchTodos,
	toggleEdit,
} from "../store/actions/TodoAction";
import { useSelector } from "react-redux";
import "./Todo.css";

const Todo = () => {
	const [task, setTask] = useState("");
	const [spinner, setSpinner] = useState(null);
	const [editValue, setEditValue] = useState("");

	const dispatch = useDispatch();
	const loader = useSelector((state) => state.todo.loader);
	const adding = useSelector((state) => state.todo.isAdding);
	const checked = useSelector((state) => state.todo.isChecked);
	const todoData = useSelector((state) => state.todo.todoData);
	const toggleBtn = useSelector((state) => state.todo.toggleBtn);
	const updating = useSelector((state) => state.todo.isUpdating);
	const deleting = useSelector((state) => state.todo.isDeleting);

	const handleSubmit = (e) => {
		e.preventDefault();
		let uid = localStorage.getItem("auth");
		const todo = { task, checked: false };
		dispatch(addTodo(uid, todo)).then(() => {
			setTask("");
		});
	};

	const handleCheckTodo = (id, checked) => {
		setSpinner(id);
		setTimeout(() => {
			dispatch(checkTodo(id, checked));
		}, 1000);
	};

	const handleDeleteTodo = (id) => {
		setSpinner(id);
		dispatch(delTodo(id));
	};

	const handleEditTodo = (id, value) => {
		setEditValue(value);
		dispatch(toggleEdit(id));
	};

	const handleSaveTodo = (id) => {
		setSpinner(id);
		const item = { value: editValue, id };
		dispatch(editTodo(item));
	};

	const handleToggleEdit = (value) => {
		dispatch(toggleEdit(value));
	};

	useEffect(() => {
		dispatch(fetchTodos());
	}, []);

	return (
		<>
			<section className="header-section bg-secondary p-3 rounded text-center">
				<h1>Firebase Todo App</h1>
			</section>
			{loader ? (
				<div className="d-flex justify-content-center my-5">
					<div className="spinner-border" role="status">
						<span className="visually-hidden"></span>
					</div>
				</div>
			) : (
				<>
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
								<Button color="primary" type="submit" disabled={adding}>
									{!adding ? (
										"Add to List"
									) : (
										<>
											<span
												className="spinner-border spinner-border-sm"
												aria-hidden="true"
											></span>
											<span className="visually-hidden" role="status"></span>
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
									className="d-flex flex-row justify-content-between align-items-center my-3 container card shadow-md"
									key={todo.id}
								>
									<CardBody className="row">
										<div className="col-7 pr-0">
											{toggleBtn !== todo.id ? (
												<Input
													type="checkbox"
													checked={todo?.checked}
													disabled={checked && todo.id === spinner}
													onChange={() =>
														handleCheckTodo(todo.id, todo?.checked)
													}
												/>
											) : (
												<Input
													type="text"
													value={editValue}
													onChange={(e) => setEditValue(e.target.value)}
												/>
											)}
											{toggleBtn !== todo.id && (
												<label
													className={`m-0 ${
														todo.checked ? "checked" : "notChecked"
													}`}
												>
													{todo.task}
												</label>
											)}
										</div>
										{toggleBtn !== todo.id ? (
											<div className="d-flex align-items-center justify-content-between col-4">
												<Button
													size="sm"
													color="info"
													onClick={() => handleEditTodo(todo.id, todo.task)}
													disabled={todo.checked}
												>
													Edit
												</Button>
												<Button
													size="sm"
													color="danger"
													disabled={deleting}
													onClick={() => handleDeleteTodo(todo.id)}
												>
													{deleting && todo.id === spinner ? (
														<>
															<span
																className="spinner-border spinner-border-sm"
																aria-hidden="true"
															></span>
															<span
																className="visually-hidden"
																role="status"
															></span>
														</>
													) : (
														<>Delete</>
													)}
												</Button>
											</div>
										) : (
											<div className="d-flex align-items-center justify-content-between col-4">
												<Button
													color="success"
													size="sm"
													className="mr-1"
													onClick={() => handleSaveTodo(todo.id)}
												>
													{updating && todo.id === spinner ? (
														<>
															<span
																className="spinner-border spinner-border-sm"
																aria-hidden="true"
															></span>
															<span
																className="visually-hidden"
																role="status"
															></span>
														</>
													) : (
														<>Save</>
													)}
												</Button>
												<Button
													color="secondary"
													size="sm"
													onClick={() => handleToggleEdit(null)}
												>
													cancel
												</Button>
											</div>
										)}
									</CardBody>
								</Card>
							);
						})}
					</section>
				</>
			)}
		</>
	);
};

export default Todo;
