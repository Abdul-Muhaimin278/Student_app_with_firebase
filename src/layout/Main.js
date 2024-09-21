const Main = (props) => {
	return (
		<>
			<header>Main Header</header>
			<Outlet />
			{props.children}
			<footer>Main Footer</footer>
		</>
	);
};

export default Main;
