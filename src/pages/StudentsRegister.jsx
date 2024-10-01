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
	const {
		studentsData,
		lastVisible,
		loader,
		isAdding,
		toggleBtn,
		isUpdating,
		isDeleting,
		applyingFilter,
	} = useSelector((state) => state.student);
	const { userData, loading } = useSelector((state) => state.auth);

	const [studentName, setStudentName] = useState("");
	const [studentAge, setStudentAge] = useState("");
	const [studentRollNo, setStudentRollNo] = useState("");
	const [spinner, setSpinner] = useState(null);
	const [editIndex, setEditIndex] = useState(null);
	const [filter, setFilter] = useState({
		searchName: "",
		searchRollNo: "",
		order: "asc",
	});

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

	const handleSearchByName = (value) => {
		setFilter((prev) => ({ ...prev, searchName: value }));
	};

	const handleSearchByRollNo = (value) => {
		setFilter((prev) => ({ ...prev, searchRollNo: value }));
	};

	const handleDropDown = (value) => {
		setFilter((prev) => ({ ...prev, order: value }));
	};

	const handleApplyFilter = () => {
		dispatch(fetchStudents(userData?.uid, filter));
	};

	const handleClearFilter = () => {
		let filter = { searchName: "", searchRollNo: "", order: "asc" };
		setFilter(filter);

		dispatch(fetchStudents(userData?.uid, filter));
	};

	const handleLoadMore = () => {
		// const lastVise-able = lastVisible ? lastVisible : "notLastVisible";
		dispatch(fetchStudents(userData?.uid, filter, lastVisible));
	};

	useEffect(() => {
		dispatch(fetchStudents(userData?.uid, filter));
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
					{loading ? <Spinner size="sm"></Spinner> : <>Log out</>}
				</Button>
			</section>
			{/* {loader ? (
				<Spinner className="d-flex justify-content-center mx-auto mt-5"></Spinner>
			) : ( */}
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
									{isAdding ? <Spinner size="sm"></Spinner> : <>Add to List</>}
								</Button>
							)}
						</FormGroup>
					</Form>
				</section>
				<section className="d-flex align-items-center justify-content-center">
					<div className="d-flex align-items-center search-section">
						<Input
							required
							placeholder="Search student name"
							id="search-name"
							type="text"
							name="search-name"
							className="mx-2 search-input"
							value={filter.searchName}
							autoComplete="off"
							onChange={(e) => handleSearchByName(e.target.value)}
						/>
						<Input
							required
							placeholder="Search student rollNo"
							id="search-rollNo"
							type="number"
							name="search-rollNo"
							className="mx-2 search-input"
							value={filter.searchRollNo}
							autoComplete="off"
							onChange={(e) => handleSearchByRollNo(e.target.value)}
						/>

						<select
							name="sort"
							id="sort"
							value={filter.dropDown}
							className="mx-2 rounded "
							onChange={(e) => handleDropDown(e.target.value)}
						>
							<option value="asc">Oldest</option>
							<option value="desc">Latest</option>
						</select>
						<Button
							color="primary"
							className="mx-2"
							onClick={handleApplyFilter}
						>
							Apply
							{/* {applyingFilter ? <Spinner size="sm"></Spinner> : <>Apply</>} */}
						</Button>
						<Button color="danger" onClick={handleClearFilter}>
							Clear
						</Button>
					</div>
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
							{studentsData.map((student, index) => {
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
											<td className="d-flex justify-content-between buttons">
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

				<div className="d-flex justify-content-center my-3">
					<Button color="success" onClick={handleLoadMore}>
						Load More
					</Button>
				</div>
			</>
			{/* )} */}
		</>
	);
};

export default StudentRegister;
