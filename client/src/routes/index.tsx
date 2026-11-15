import { createFileRoute, Link } from "@tanstack/react-router";
import {
	Accessibility,
	ArrowRight,
	Armchair,
	DoorClosed,
	type LucideIcon,
	MapPin,
	Sparkles,
	Wind,
} from "lucide-react";
import type { CSSProperties } from "react";
import styles from "../assets/styles/index.module.css";
import { BUILDING_META } from "../features/restrooms/buildingMeta";
import {
	buildingCounts,
	overallRating,
	sortRestrooms,
} from "../features/restrooms/directory/directoryLogic";
import { directoryLinkSearch } from "../features/restrooms/directory/searchParams";
import { MOCK_RESTROOMS } from "../features/restrooms/mock";
import {
	BUILDINGS,
	type Building,
	GENDER_LABELS,
} from "../features/restrooms/types";

export const Route = createFileRoute("/")({
	component: Index,
});

const BUILDING_COUNTS = buildingCounts(MOCK_RESTROOMS);
const TOP_RATED = sortRestrooms(MOCK_RESTROOMS, "highest-rated").slice(0, 3);
const REVIEW_TOTAL = MOCK_RESTROOMS.reduce(
	(sum, restroom) => sum + restroom.reviewCount,
	0,
);

const DIMENSIONS: { name: string; copy: string; icon: LucideIcon }[] = [
	{
		name: "Cleanliness",
		copy: "Surfaces, floors, and fixtures.",
		icon: Sparkles,
	},
	{ name: "Smell", copy: "Fresh air, not a warning sign.", icon: Wind },
	{ name: "Privacy", copy: "Doors that latch and gaps that don't.", icon: DoorClosed },
	{ name: "Comfort", copy: "Space, ventilation, and a calm minute.", icon: Armchair },
	{
		name: "Accessibility",
		copy: "PWD access, grab bars, and room to move.",
		icon: Accessibility,
	},
];

function buildingSearch(building: Building) {
	return directoryLinkSearch({ building: [building] });
}

function Index() {
	return (
		<main className={styles.page}>
			<section className={styles.hero}>
				<div className={styles.heroCopy}>
					<p className={styles.place}>
						<MapPin aria-hidden="true" />
						Mapúa Intramuros, {MOCK_RESTROOMS.length} restrooms,{" "}
						{REVIEW_TOTAL} student reviews
					</p>
					<h1 className={styles.headline}>
						Find the best
						<br />
						restroom
						<br />
						on campus.
					</h1>
					<p className={styles.lede}>
						Every restroom at Mapúa, rated by the people who use it. Check the
						building, the floor, and what you're walking into before you go.
					</p>
					<div className={styles.actions}>
						<Link
						to="/directory"
						search={directoryLinkSearch()}
						className={styles.primaryAction}
					>
							Browse the directory
							<ArrowRight aria-hidden="true" />
						</Link>
						<a href="#how-ratings" className={styles.textAction}>
							How ratings work
						</a>
					</div>
				</div>

				<aside className={styles.quickFind} aria-labelledby="quick-find-title">
					<header className={styles.quickHead}>
						<span>Quick find</span>
						<span className={styles.quickCount}>4 buildings</span>
					</header>
					<h2 id="quick-find-title" className={styles.quickTitle}>
						Which building are you in?
					</h2>
					<ul className={styles.buildingList}>
						{BUILDINGS.map((building) => {
							const meta = BUILDING_META[building];
							return (
								<li key={building}>
									<Link
										to="/directory"
										search={buildingSearch(building)}
										className={styles.buildingRow}
										style={{ "--building": meta.color } as CSSProperties}
									>
										<span className={styles.buildingDot} aria-hidden="true" />
										<span className={styles.buildingName}>{meta.label}</span>
										<span className={styles.buildingCount}>
											{BUILDING_COUNTS[building] ?? 0} restrooms
										</span>
										<ArrowRight
											className={styles.buildingArrow}
											aria-hidden="true"
										/>
									</Link>
								</li>
							);
						})}
					</ul>
					{TOP_RATED[0] && (
						<div className={styles.quickFooter}>
							<span>Top rated on campus</span>
							<span className={styles.topScore}>
								<span className={styles.topCode}>
									{TOP_RATED[0].restroomId}
								</span>
								💩 {overallRating(TOP_RATED[0]).toFixed(1)}
							</span>
						</div>
					)}
				</aside>
			</section>

			<section className={styles.shortlist} aria-labelledby="shortlist-title">
				<div className={styles.sectionHead}>
					<h2 id="shortlist-title">The shortlist</h2>
					<p>The three highest-rated restrooms on campus right now.</p>
				</div>
				<ol className={styles.rankList}>
					{TOP_RATED.map((restroom, index) => (
						<li key={restroom.restroomId} className={styles.rankItem}>
							<span className={styles.rankNumber} aria-hidden="true">
								{String(index + 1).padStart(2, "0")}
							</span>
							<span className={styles.rankCode}>{restroom.restroomId}</span>
							<h3 className={styles.rankName}>{restroom.name}</h3>
							<p className={styles.rankMeta}>
								{BUILDING_META[restroom.building].label}, floor{" "}
								{restroom.floor}, {GENDER_LABELS[restroom.gender].toLowerCase()}
							</p>
							<p className={styles.rankScore}>
								<span aria-hidden="true">💩</span>
								<strong>{overallRating(restroom).toFixed(1)}</strong>
								<span className={styles.rankOutOf}>out of 5</span>
							</p>
						</li>
					))}
				</ol>
				<Link
					to="/directory"
					search={directoryLinkSearch()}
					className={styles.sectionLink}
				>
					See all {MOCK_RESTROOMS.length} restrooms
					<ArrowRight aria-hidden="true" />
				</Link>
			</section>

			<section id="how-ratings" className={styles.how}>
				<div className={styles.sectionHead}>
					<h2>Five things we rate</h2>
					<p>
						Every restroom is scored from 1 to 5 on the parts of the trip that
						matter. More poop is better.
					</p>
				</div>
				<dl className={styles.dimensions}>
					{DIMENSIONS.map(({ name, copy, icon: Icon }) => (
						<div key={name} className={styles.dimension}>
							<Icon className={styles.dimensionIcon} aria-hidden="true" />
							<dt>{name}</dt>
							<dd>{copy}</dd>
						</div>
					))}
				</dl>
			</section>
		</main>
	);
}
