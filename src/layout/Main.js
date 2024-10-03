import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const Main = (props) => {
	const { userData } = useSelector((state) => state?.auth);
	const history = useHistory();

	if (!userData?.uid) {
		history.push("/login");
		return null;
	}

	return (
		<>
			{/* <header>Main Header</header> */}
			{props.children}
			{/* <footer>Main Footer</footer> */}
		</>
	);
};

export default Main;
