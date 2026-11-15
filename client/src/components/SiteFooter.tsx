import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Radar } from "lucide-react";
import styles from "../assets/styles/footer.module.css";
import { directoryLinkSearch } from "../features/restrooms/directory/searchParams";

const PROJECT_URL = "https://github.com/cobbdzon/restroom-radar";

function SiteFooter() {
	return (
		<footer className={styles.footer}>
			<div className={styles.inner}>
				<div className={styles.brandCol}>
					<Link to="/" className={styles.brand}>
						<span className={styles.mark} aria-hidden="true">
							<Radar />
						</span>
						<span>Restroom Radar</span>
					</Link>
					<p className={styles.blurb}>
						Student ratings for the restrooms at Mapúa University,
						Intramuros.
					</p>
				</div>

				<nav className={styles.linkCol} aria-label="Footer">
					<h2>Explore</h2>
					<Link to="/directory" search={directoryLinkSearch()}>
						Restroom directory
					</Link>
					<Link to="/about">About the project</Link>
					<Link to="/contact">Contact</Link>
				</nav>

				<div className={styles.linkCol}>
					<h2>Campus</h2>
					<p>
						Mapúa University
						<br />
						Intramuros, Manila
					</p>
				</div>

				<div className={styles.linkCol}>
					<h2>Project</h2>
					<a href={PROJECT_URL} target="_blank" rel="noreferrer">
						Source and issues
						<ArrowUpRight aria-hidden="true" />
					</a>
					<p className={styles.note}>
						Built by students. This demo runs on sample ratings.
					</p>
				</div>
			</div>

			<div className={styles.bottom}>
				<span>© {new Date().getFullYear()} Restroom Radar</span>
				<span>Know before you go.</span>
			</div>
		</footer>
	);
}

export default SiteFooter;
