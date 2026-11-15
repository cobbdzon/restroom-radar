import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import styles from "../assets/styles/page.module.css";
import { buildingCounts } from "../features/restrooms/directory/directoryLogic";
import { directoryLinkSearch } from "../features/restrooms/directory/searchParams";
import { MOCK_RESTROOMS } from "../features/restrooms/mock";

export const Route = createFileRoute("/about")({
	head: () => ({
		meta: [{ title: "About" }],
	}),
	component: RouteComponent,
});

const RESTROOM_TOTAL = MOCK_RESTROOMS.length;
const BUILDING_TOTAL = Object.keys(buildingCounts(MOCK_RESTROOMS)).length;
const REVIEW_TOTAL = MOCK_RESTROOMS.reduce(
	(sum, restroom) => sum + restroom.reviewCount,
	0,
);

const RATING_DIMENSIONS = [
	{
		name: "Cleanliness",
		copy: "Floors, fixtures, and whether the supply table is stocked.",
	},
	{
		name: "Smell",
		copy: "Ventilation and odor, judged as soon as you reach the door.",
	},
	{
		name: "Privacy",
		copy: "Latching doors, working locks, and gaps that don't face the hall.",
	},
	{
		name: "Comfort",
		copy: "Room to move, hooks that hold a bag, and air that keeps moving.",
	},
	{
		name: "Accessibility",
		copy: "PWD stalls, grab bars, and step-free access from the corridor.",
	},
];

function RouteComponent() {
	return (
		<main className={styles.page}>
			<header className={styles.header}>
				<h1 className={styles.title}>Built for the walk between classes.</h1>
				<p className={styles.lede}>
					Restroom Radar is a student-run directory of the restrooms at Mapúa
					University's Intramuros campus. It answers one question fast: which
					restroom is worth the walk right now?
				</p>
			</header>

			<div className={styles.layout}>
				<div className={styles.prose}>
					<section className={styles.section}>
						<h2>What you'll find</h2>
						<p>
							Every listing shows the building, floor, stall count, amenities,
							and whether the restroom is PWD accessible. The directory can be
							filtered by building, gender, amenities, and minimum rating, so
							you can narrow the campus down before you commit to a corridor.
						</p>
						<p>
							Scores run from 1 to 5 and are averaged from student reviews. A
							restroom with no reviews is marked <strong>New</strong> instead of
							being given a zero.
						</p>
					</section>

					<section className={styles.section}>
						<h2>How ratings work</h2>
						<p>
							One overall score hides too much. Each review rates five things
							separately, and the card shows the breakdown:
						</p>
						<dl className={styles.dimensionList}>
							{RATING_DIMENSIONS.map((dimension) => (
								<div key={dimension.name} className={styles.dimension}>
									<dt>{dimension.name}</dt>
									<dd>{dimension.copy}</dd>
								</div>
							))}
						</dl>
					</section>

					<section className={styles.section}>
						<h2>About this demo</h2>
						<p>
							This build runs on sample data while the review system is being
							built. The directory, filters, and layouts are real; the ratings
							are placeholders.
						</p>
						<div className={styles.note}>
							<strong>Why it exists.</strong> Campus restrooms change by floor,
							by building, and by time of day. A shared record makes the good
							ones easier to find and the bad ones harder to ignore.
						</div>
					</section>
				</div>

				<aside className={styles.facts} aria-labelledby="facts-title">
					<h2 id="facts-title">At a glance</h2>
					<dl>
						<div>
							<dt>Restrooms listed</dt>
							<dd>{RESTROOM_TOTAL}</dd>
						</div>
						<div>
							<dt>Buildings covered</dt>
							<dd>{BUILDING_TOTAL}</dd>
						</div>
						<div>
							<dt>Student reviews</dt>
							<dd>{REVIEW_TOTAL}</dd>
						</div>
						<div>
							<dt>Rating scale</dt>
							<dd>1–5</dd>
						</div>
					</dl>
					<Link
						to="/directory"
						search={directoryLinkSearch()}
						className={styles.factsLink}
					>
						Open the directory
						<ArrowRight aria-hidden="true" />
					</Link>
				</aside>
			</div>
		</main>
	);
}
