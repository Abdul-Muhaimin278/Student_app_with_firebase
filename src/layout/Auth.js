import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const Auth = (props) => {
	const { userData } = useSelector((state) => state?.auth);
	const history = useHistory();

	if (userData?.uid) {
		history.push("/students");
	}

	return <>{props.children}</>;
};

export default Auth;
