import { Accessibility } from "lucide-react";
import type { CSSProperties } from "react";
import styles from "../../../../assets/styles/restroomCard.module.css";
import { BUILDING_META } from "../../buildingMeta";
import { GENDER_LABELS, type Restroom, TAG_LABELS } from "../../types";
import { overallRating } from "../directoryLogic";
import { DimensionRatings } from "./DimensionRatings";

export function RestroomCard({ restroom }: { restroom: Restroom }) {
	const rating = restroom.ratings === null ? null : overallRating(restroom);
	const building = BUILDING_META[restroom.building];

	return (
		<article
			className={styles.card}
			style={{ "--building": building.color } as CSSProperties}
		>
			<div className={styles.plateTop}>
				<span className={styles.plateCode}>{restroom.restroomId}</span>
				<span className={styles.plateFloor}>
					{building.short}, floor {restroom.floor}
				</span>
			</div>

			<div className={styles.cardBody}>
				<div className={styles.cardHead}>
					<div className={styles.identity}>
						<h2 className={styles.cardTitle}>{restroom.name}</h2>
						<p className={styles.cardMeta}>
							<span>{GENDER_LABELS[restroom.gender]} restroom</span>
							<span
								className={
									restroom.isPwdAccessible ? styles.pwd : styles.pwdOff
								}
							>
								<Accessibility aria-hidden="true" />
								{restroom.isPwdAccessible ? "PWD accessible" : "No PWD access"}
							</span>
						</p>
					</div>
					{rating !== null ? (
						<span
							className={styles.scoreBox}
							role="img"
							aria-label={`Rated ${rating.toFixed(1)} out of 5`}
						>
							<span className={styles.scorePoop} aria-hidden="true">
								💩
							</span>
							<strong className={styles.scoreValue}>{rating.toFixed(1)}</strong>
							<span className={styles.scoreOut} aria-hidden="true">
								/5
							</span>
						</span>
					) : (
						<span className={styles.scoreNew}>New</span>
					)}
				</div>

				{restroom.ratings !== null ? (
					<DimensionRatings ratings={restroom.ratings} />
				) : (
					<p className={styles.noRatings}>No student ratings yet.</p>
				)}

				{restroom.tags.length > 0 && (
					<ul className={styles.tagList} aria-label="Amenities">
						{restroom.tags.map((tag) => (
							<li key={tag} className={styles.tag}>
								{TAG_LABELS[tag]}
							</li>
						))}
					</ul>
				)}

				<footer className={styles.cardFooter}>
					<span>
						{restroom.stallCount}{" "}
						{restroom.stallCount === 1 ? "stall" : "stalls"}
					</span>
					<span>
						{restroom.reviewCount}{" "}
						{restroom.reviewCount === 1 ? "review" : "reviews"}
					</span>
				</footer>
			</div>
		</article>
	);
}
