import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const Main = (props) => {
	const { userData } = useSelector((state) => state?.auth);
	const history = useHistory();

	if (!userData?.uid) {
		history.push("/login");
		return null;
	}

	return <>{props.children}</>;
};

export default Main;
