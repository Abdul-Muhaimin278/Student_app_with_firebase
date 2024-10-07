import { useEffect, useRef, useState } from "react";
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
import { TiDeleteOutline } from "react-icons/ti";

const StudentRegister = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const imageRef = useRef(null);
	const {
		studentsData,
		lastVisible,
		isAdding,
		toggleBtn,
		isUpdating,
		isDeleting,
		hasMore,
	} = useSelector((state) => state.student);
	const { userData, loading } = useSelector((state) => state.auth);

	const [studentName, setStudentName] = useState("");
	const [studentAge, setStudentAge] = useState("");

	const [fetchLoader, setFetchLoader] = useState(false);
	const [spinner, setSpinner] = useState(null);

	const [editIndex, setEditIndex] = useState(null);
	const [editData, setEditData] = useState(null);

	const [filter, setFilter] = useState({
		searchName: "",
		searchRollNo: "",
		order: "desc",
	});
	const [filterDone, setFilterDone] = useState(null);
	const [filterLoader, setFilterLoader] = useState(false);
	const [filterApplied, setFilterApplied] = useState(false);
	const [clearedFilter, setClearedFilter] = useState(false);

	const [loadMore, setLoadMore] = useState(false);

	const [image, setImage] = useState(null);

	const handleImage = (e) => {
		setImage(e.target.files[0]);
	};

	const removeImageButton = () => {
		setImage(null);
		if (imageRef.current) {
			imageRef.current.value = "";
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const studentData = {
			name: studentName,
			age: studentAge,
		};
		const student = studentData;

		dispatch(addStudents(userData?.uid, image, student)).then(() => {
			setStudentName("");
			setStudentAge("");
			setImage(null);
			imageRef.current.value = "";
		});
	};

	const handleDeleteStudent = (id) => {
		setSpinner(id);
		dispatch(delStudent(id));
	};

	const handleEditStudent = (item) => {
		const { id, name, age, rollNo, uid } = item;
		setStudentName(name);
		setStudentAge(age);
		setEditIndex(id);
		setEditData({ rollNo, uid });

		dispatch(toggleEdit(id));
	};

	const handleSaveStudent = () => {
		const item = {
			id: editIndex,
			name: studentName,
			age: studentAge,
			rollNo: editData?.rollNo,
			createdBy: editData?.uid,
			image,
		};
		dispatch(editStudent(item)).then(() => {
			setStudentName("");
			setStudentAge("");
			setEditIndex(null);
			setEditData(null);
			setImage(null);
			imageRef.current.value = "";
		});
	};

	const handleCancelBtn = (value) => {
		dispatch(toggleEdit(value));
		setStudentName("");
		setStudentAge("");
		setEditIndex(null);
		setImage(null);
		imageRef.current.value = "";
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
		const filterData = {
			...filter,
		};
		setFilterDone(filterData);
		setFilterLoader(true);

		dispatch(fetchStudents(userData?.uid, filter))
			.then(() => setFilterApplied(true))
			.finally(() => {
				setFilterLoader(false);
			});
	};

	const handleClearFilter = () => {
		let filter = { searchName: "", searchRollNo: "", order: "desc" };
		setFilterApplied(false);

		setFilter(filter);
		setClearedFilter(true);
		dispatch(fetchStudents(userData?.uid, filter)).finally(() =>
			setClearedFilter(false)
		);
	};

	const handleLoadMore = () => {
		setLoadMore(true);
		console.log("in-load-more =>", filterApplied);

		dispatch(
			fetchStudents(
				userData?.uid,
				filterApplied
					? filterDone
					: {
							order: "desc",
					  },

				lastVisible
			)
		).finally(() => setLoadMore(false));
	};

	useEffect(() => {
		if (userData?.uid) {
			setFetchLoader(true);
			dispatch(fetchStudents(userData?.uid, filter)).finally(() =>
				setFetchLoader(false)
			);
		}
	}, []);

	return (
		<>
			{/*//^============== HEADER SECTION============== */}

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
			{fetchLoader ? (
				<Spinner
					className="d-flex justify-content-center mx-auto mt-5"
					size="lg"
				></Spinner>
			) : (
				<>
					{/*//^============== FORM SECTION============== */}

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
									className="m-1"
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
									className="m-1"
									onChange={(e) => setStudentAge(e.target.value)}
								/>
							</FormGroup>
							<div className="d-flex align-items-center justify-content  image-div mb-0">
								<Input
									id="student-image"
									type="file"
									// accept=".jpg, .jpeg, .png"
									name="student-image"
									ref={imageRef}
									className="m-1 d-none"
									value={image ? "" : undefined}
									onChange={handleImage}
								/>
								<label
									htmlFor="student-image"
									className="mb-0 photo-label"
									role="button"
								>
									Choose Image
								</label>
								{image && (
									<>
										<TiDeleteOutline
											className="TiDeleteOutline"
											onClick={removeImageButton}
										/>
										<img
											src={image ? URL.createObjectURL(image) : null}
											alt=""
										/>
									</>
								)}
							</div>
							<FormGroup className="m-0">
								{toggleEdit !== null && editIndex ? (
									<Button
										color="success"
										className="ml-3"
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
					</section>

					{/*//^============== FILTER & SEARCH SECTION============== */}

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

							<Input
								name="sort"
								id="sort"
								type="select"
								value={filter.dropDown}
								className="mx-2 rounded"
								onChange={(e) => handleDropDown(e.target.value)}
							>
								<option value="desc">Latest</option>
								<option value="asc">Oldest</option>
							</Input>
							<Button
								color="primary"
								className="mx-2"
								onClick={handleApplyFilter}
							>
								{filterLoader ? <Spinner size="sm"></Spinner> : <>Apply</>}
							</Button>
							<Button color="danger" onClick={handleClearFilter}>
								{clearedFilter ? <Spinner size="sm"></Spinner> : <>Clear</>}
							</Button>
						</div>
					</section>

					{/*//^============== TABLE  SECTION============== */}

					<section className="list-section text-capitalize container d-flex justify-content-center ">
						<Table borderless className="text-center table">
							<thead>
								<tr>
									<th>#</th>
									<th>Image</th>
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
											<th>
												<img
													src={student?.imageURL ? student?.imageURL : null}
													alt=""
												/>
											</th>
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
																uid: student?.createdBy,
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
														onClick={() => handleCancelBtn(null)}
													>
														Cancel
													</Button>
												</td>
											)}
										</tr>
									);
								})}
							</tbody>
						</Table>
					</section>

					{/* ============== LOAD MORE BUTTON============== */}
					{hasMore !== studentsData.length && (
						<div className="d-flex justify-content-center my-3">
							<Button color="success" onClick={handleLoadMore}>
								{loadMore ? <Spinner size="sm"></Spinner> : <>Load More</>}
							</Button>
						</div>
					)}
				</>
			)}
		</>
	);
};

export default StudentRegister;
