import styles from "../assets/styles/TopBar.module.css";

function TopBar() {
	return (
		<div className={styles.topbar}>
			<div className="left">Left</div>
			<nav className="center">Center</nav>
			<div className="right">Right</div>
		</div>
	);
}

export default TopBar;
