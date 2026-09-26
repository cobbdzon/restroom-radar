import { ChevronRight } from "lucide-react";
import styles from "../../../../assets/styles/restroomCard.module.css";
import { GENDER_LABELS, type Restroom } from "../../types";
import { overallRating } from "../directoryLogic";
import { DimensionRatings } from "./DimensionRatings";

export function RestroomCard({ restroom }: { restroom: Restroom }) {
	const rating = restroom.ratings === null ? null : overallRating(restroom);

	return (
		<article className={styles.card}>
			<div className={styles.cardTop}>
				<div className={styles.cardIdentity}>
					<span className={styles.avatar} aria-hidden="true">
						{restroom.building.charAt(0)}
					</span>
					<div>
						<h3 className={styles.cardTitle}>{restroom.restroomId}</h3>
						<p className={styles.cardMeta}>
							{restroom.building} Building · {restroom.floor}F ·{" "}
							{GENDER_LABELS[restroom.gender]}
							{restroom.pwdAccessible ? " · PWD" : ""}
						</p>
					</div>
				</div>
				{rating !== null ? (
					<span
						className={styles.ratingPill}
						title="Average student rating, 1–5"
					>
						💩 {rating.toFixed(1)}
					</span>
				) : (
					<span
						className={`${styles.ratingPill} ${styles.ratingPillEmpty}`}
						title="No reviews yet"
					>
						New
					</span>
				)}
			</div>

			{restroom.ratings !== null && (
				<DimensionRatings ratings={restroom.ratings} />
			)}

			{restroom.reviewCount === 0 ? (
				<p className={styles.cardQuote}>
					"No user reviews yet — be the first to rate."
				</p>
			) : (
				<p className={styles.cardReviews}>
					Average of {restroom.reviewCount}{" "}
					{restroom.reviewCount === 1 ? "review" : "reviews"}.
				</p>
			)}

			<footer className={styles.cardFooter}>
				<span className={styles.stallCount}>
					{restroom.stallCount} {restroom.stallCount === 1 ? "stall" : "stalls"}
				</span>
				<span className={styles.detailsLink}>
					Details
					<ChevronRight aria-hidden="true" />
				</span>
			</footer>
		</article>
	);
}
