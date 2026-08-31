import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import styles from "../assets/styles/index.module.css";
import TopBar from "../components/TopBar";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	return (
		<>
			<TopBar />
			<div>
				<div className={styles.hero}>
					<h1 className={styles.hero_header}>
						When nature calls, <br />
						know where to go.
					</h1>
					<span className={styles.hero_description}>
						"Your ultimate solution for urgent excrement expulsion concerns.
					</span>
					<a
						className={`${styles.hero_button} styled_button primary`}
						href="/directory"
					>
						Start Exploring
						<ArrowRight className={styles.hero_button_icon} />
					</a>
				</div>
			</div>
		</>
	);
}
