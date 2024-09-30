import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const Auth = (props) => {
	const { userData } = useSelector((state) => state?.auth);
	const history = useHistory();
	useEffect(() => {
		userData?.uid && history.push("/students");
	}, []);
	return (
		<>
			{/* <header>Auth Header</header> */}
			{props.children}
			{/* <footer>Auth Footer</footer> */}
		</>
	);
};

export default Auth;
