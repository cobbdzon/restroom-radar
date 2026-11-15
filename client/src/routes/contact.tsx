import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Check } from "lucide-react";
import styles from "../assets/styles/page.module.css";
import { directoryLinkSearch } from "../features/restrooms/directory/searchParams";

export const Route = createFileRoute("/contact")({
	head: () => ({
		meta: [{ title: "Contact — Restroom Radar" }],
	}),
	component: RouteComponent,
});

const ISSUES_URL = "https://github.com/cobbdzon/restroom-radar/issues";

function RouteComponent() {
	return (
		<main className={styles.page}>
			<header className={styles.header}>
				<h1 className={styles.title}>Tell us what's missing.</h1>
				<p className={styles.lede}>
					Found a restroom we don't list, a fixture that's out of order, or a
					detail that's changed? The project lives on GitHub, and issues are the
					fastest way to reach it.
				</p>
			</header>

			<div className={styles.layout}>
				<div className={styles.prose}>
					<section className={styles.section}>
						<h2>Open an issue</h2>
						<p>
							Include the building, floor, and what changed. A photo helps if
							something is broken. You don't need to write a long report. A room
							code and one sentence is enough to start.
						</p>
						<div className={styles.actions}>
							<a
								className={styles.primaryAction}
								href={ISSUES_URL}
								target="_blank"
								rel="noreferrer"
							>
								Open an issue
								<ArrowUpRight aria-hidden="true" />
							</a>
							<Link
								to="/directory"
								search={directoryLinkSearch()}
								className={styles.secondaryAction}
							>
								Back to the directory
							</Link>
						</div>
					</section>

					<section className={styles.section}>
						<h2>What to include</h2>
						<ul className={styles.checkList}>
							<li>
								<Check aria-hidden="true" />
								The building and floor, plus the room code if you can see one.
							</li>
							<li>
								<Check aria-hidden="true" />
								What changed: a new restroom, a closed stall, a broken fixture,
								or a missing amenity.
							</li>
							<li>
								<Check aria-hidden="true" />
								Whether the restroom is PWD accessible, if you can confirm it.
							</li>
						</ul>
					</section>

					<section className={styles.section}>
						<h2>What this isn't</h2>
						<p>
							Restroom Radar isn't an official Mapúa service. For urgent
							facilities problems, contact campus maintenance directly. This
							site is a student record, not a work order.
						</p>
					</section>
				</div>

				<aside className={styles.facts} aria-labelledby="contact-notes-title">
					<h2 id="contact-notes-title">Quick notes</h2>
					<p>
						<span aria-hidden="true">💩</span> Ratings in this demo are sample
						data. The review flow is still being built.
					</p>
					<p>
						Feedback about the directory itself is welcome too, especially if a
						filter or a card is hard to read.
					</p>
					<a
						className={styles.factsLink}
						href={ISSUES_URL}
						target="_blank"
						rel="noreferrer"
					>
						Go to the issue tracker
						<ArrowUpRight aria-hidden="true" />
					</a>
				</aside>
			</div>
		</main>
	);
}
