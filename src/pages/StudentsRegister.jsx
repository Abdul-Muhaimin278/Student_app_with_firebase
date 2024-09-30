import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Form, FormGroup, Input, Spinner, Table } from "reactstrap";
import {
	toggleEdit,
	fetchStudents,
	addStudents,
	delStudent,
	editStudent,
} from "../store/actions/StudentAction";
import { useSelector } from "react-redux";
import "../assets/css/style.css";
import { useHistory } from "react-router-dom";
import { logout } from "../store/actions/authAction";

const StudentRegister = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const { studentsData, loader, isAdding, toggleBtn, isUpdating, isDeleting } =
		useSelector((state) => state.student);
	const { userData, loading } = useSelector((state) => state.auth);

	const [studentName, setStudentName] = useState("");
	const [studentAge, setStudentAge] = useState("");
	const [studentRollNo, setStudentRollNo] = useState("");
	const [allStudents, setAllStudents] = useState(studentsData);
	const [spinner, setSpinner] = useState(null);
	const [editIndex, setEditIndex] = useState(null);
	// const [search, setSearch] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		const studentData = {
			name: studentName,
			age: studentAge,
			rollNo: studentRollNo,
		};
		const student = studentData;

		dispatch(addStudents(userData?.uid, student)).then(() => {
			setStudentName("");
			setStudentAge("");
			setStudentRollNo("");
		});
	};

	const handleDeleteStudent = (id) => {
		setSpinner(id);
		dispatch(delStudent(id));
	};

	const handleEditStudent = (item) => {
		const { id, name, age, rollNo } = item;
		setStudentName(name);
		setStudentAge(age);
		setStudentRollNo(rollNo);
		setEditIndex(id);
		dispatch(toggleEdit(id));
	};

	const handleSaveStudent = () => {
		// setSpinner(editIndex);
		const item = {
			id: editIndex,
			name: studentName,
			age: studentAge,
			rollNo: studentRollNo,
		};
		dispatch(editStudent(item));
		setStudentName("");
		setStudentAge("");
		setStudentRollNo("");
		setEditIndex(null);
	};

	const handleToggleEdit = (value) => {
		dispatch(toggleEdit(value));
	};

	const handleLogout = () => {
		dispatch(
			logout(() => {
				history.push("/login");
			})
		);
	};

	const handleSearch = (value) => {
		// setSearch(value);
		const filteredStudent = studentsData.filter((student) =>
			student.name.toLowerCase().includes(value.toLowerCase())
		);
		// console.log(filteredStudent);
		setAllStudents(filteredStudent);
	};

	useEffect(() => {
		dispatch(fetchStudents(userData?.uid));
	}, []);

	return (
		<>
			<section className="header-section bg-secondary p-3 rounded text-center">
				<h1>Firebase Students App</h1>
				<Button
					onClick={handleLogout}
					color="primary"
					className="d-flex align-self-center ml-auto"
				>
					{loading ? <Spinner></Spinner> : <>Log out</>}
				</Button>
			</section>

			{loader ? (
				<Spinner className="d-flex justify-content-center mx-auto mt-5"></Spinner>
			) : (
				<>
					<section className="form-section my-3 container ">
						<h2 className="text-center">Add Student</h2>
						<Form
							onSubmit={handleSubmit}
							className="d-flex align-items-center justify-content-center student-form row "
						>
							<FormGroup className="m-0 d-flex justify-content-center align-items-center ">
								<Input
									required
									placeholder="Student Name"
									id="student-name"
									type="text"
									name="student-name"
									value={studentName}
									autoComplete="off"
									onChange={(e) => setStudentName(e.target.value)}
								/>
								<Input
									required
									placeholder="Student Age"
									id="student-age"
									type="number"
									name="student-age"
									value={studentAge}
									autoComplete="off"
									onChange={(e) => setStudentAge(e.target.value)}
								/>
								<Input
									required
									placeholder="Student Rollno"
									id="student-roll-no"
									type="number"
									name="student-roll-no"
									value={studentRollNo}
									autoComplete="off"
									onChange={(e) => setStudentRollNo(e.target.value)}
								/>
							</FormGroup>
							<FormGroup className="m-0">
								{toggleEdit !== null && editIndex ? (
									<Button
										color="success"
										size="sm"
										className="mr-1"
										onClick={() => handleSaveStudent()}
									>
										{isUpdating ? <Spinner size="sm"></Spinner> : <>Save</>}
									</Button>
								) : (
									<Button
										color="primary"
										type="submit"
										className="ml-3"
										disabled={isAdding}
									>
										{isAdding ? (
											<Spinner size="sm"></Spinner>
										) : (
											<>Add to List</>
										)}
									</Button>
								)}
							</FormGroup>
						</Form>
						<FormGroup className="row d-flex flex-row align-items-center justify-content-center w-25 mx-auto mt-3">
							<Input
								required
								placeholder="Search student name"
								id="search"
								type="text"
								name="search"
								className=""
								// value={search}
								autoComplete="off"
								onChange={(e) => handleSearch(e.target.value)}
							/>

							<select name="sort" id="sort">
								<option disabled selected>
									Sort
								</option>
								<option value="oldest">Oldest</option>
								<option value="latest">Newest</option>
							</select>
							{/* <Button>Oldest</Button>
							<Button>Newest</Button> */}
						</FormGroup>
					</section>
					<section className="list-section text-capitalize container d-flex justify-content-center ">
						<Table borderless className="text-center table">
							<thead>
								<tr>
									<th>#</th>
									<th>Name</th>
									<th>Age</th>
									<th>Roll No</th>
									<th className="buttons">Buttons</th>
								</tr>
							</thead>
							<tbody>
								{allStudents.map((student, index) => {
									return (
										<tr key={student?.id}>
											<th scope="row">{index + 1}</th>
											<td>{student?.name}</td>
											<td>{student?.age}</td>
											<td>{student?.rollNo}</td>
											{toggleBtn !== student.id ? (
												<td className="d-flex justify-content-between buttons">
													<Button
														size="sm"
														color="info"
														onClick={() =>
															handleEditStudent({
																id: student?.id,
																name: student?.name,
																age: student?.age,
																rollNo: student?.rollNo,
															})
														}
													>
														Edit
													</Button>
													<Button
														size="sm"
														color="danger"
														disabled={isDeleting}
														onClick={() => handleDeleteStudent(student?.id)}
													>
														{isDeleting && student?.id === spinner ? (
															<Spinner size="sm"></Spinner>
														) : (
															<>Delete</>
														)}
													</Button>
												</td>
											) : (
												<td className=" d-flex justify-content-between buttons">
													<Button
														color="secondary"
														size="sm"
														onClick={() => handleToggleEdit(null)}
													>
														cancel
													</Button>
												</td>
											)}
										</tr>
									);
								})}
							</tbody>
						</Table>
					</section>
				</>
			)}
		</>
	);
};

export default StudentRegister;
