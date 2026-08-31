import { Link, useLocation } from "@tanstack/react-router";
import { Radar } from "lucide-react";
import styles from "../assets/styles/TopBar.module.css";

const NAV_LINKS = [
	{ to: "/directory", label: "Directory" },
	{ to: "/about", label: "About" },
	{ to: "/contact", label: "Contact" },
] as const;

function TopBar() {
	const { pathname } = useLocation();

	return (
		<div className={styles.topbar}>
			<div className={styles.left}>
				<Link to="/" className={styles.logo_link}>
					<Radar className={styles.logo_icon} aria-hidden="true" />
					Restroom Radar
				</Link>
			</div>
			<nav className={styles.right} aria-label="Primary">
				{NAV_LINKS.map((link) => {
					const isActive = pathname === link.to;
					return (
						<Link
							key={link.to}
							to={link.to}
							className={`${styles.nav_link}${isActive ? ` ${styles.active}` : ""}`}
							aria-current={isActive ? "page" : undefined}
						>
							{link.label}
						</Link>
					);
				})}
			</nav>
		</div>
	);
}

export default TopBar;
