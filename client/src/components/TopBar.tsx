import styles from "../assets/styles/TopBar.module.css";

function TopBar() {
	return (
		<div className={styles.topbar}>
			<div className={styles.left}>
				<a className={styles.logo_link} href="/">
					Restroom Radar
				</a>
			</div>
			<nav className={styles.right}>
				<a className="unstyled_link" href="/directory">
					Directory
				</a>
				<a className="unstyled_link" href="/about">
					About
				</a>
				<a className="unstyled_link" href="/contact">
					Contact
				</a>
			</nav>
		</div>
	);
}

export default TopBar;
