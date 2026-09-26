import styles from "../../../../assets/styles/restroomCard.module.css";

type RatingPillsProps = {
	value: number;
	label: string;
};

export function RatingPills({ value, label }: RatingPillsProps) {
	const filled = Math.round(value);
	const slots = Array.from({ length: 5 }, (_, index) => index + 1);

	return (
		<span
			className={styles.ratingPills}
			role="img"
			aria-label={`${label}: ${value.toFixed(1)} out of 5`}
			title="More poops is better — 1 = poor, 5 = excellent"
		>
			{slots.map((slot) => (
				<span
					key={slot}
					aria-hidden="true"
					className={`${styles.poop}${slot <= filled ? ` ${styles.poopFilled}` : ""}`}
				>
					💩
				</span>
			))}
		</span>
	);
}
