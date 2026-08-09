import styles from "../assets/styles/TopBar.module.css";

function TopBar() {
	return (
		<div className={styles.topbar}>
			<div className="left">
				<a className={`${styles.logo_link} unstyle_link`} href="/">
					Restroom Radar
				</a>
			</div>
			<nav className="center">Center</nav>
			<div className="right">Right</div>
		</div>
	);
}

export default TopBar;
