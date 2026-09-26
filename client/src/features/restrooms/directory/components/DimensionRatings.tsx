import styles from "../../../../assets/styles/restroomCard.module.css";
import {
	DIMENSION_LABELS,
	RATING_DIMENSIONS,
	type RestroomRatings,
} from "../../types";
import { RatingPills } from "./RatingPills";

export function DimensionRatings({ ratings }: { ratings: RestroomRatings }) {
	return (
		<dl className={styles.dimensionList}>
			{RATING_DIMENSIONS.map((dimension) => (
				<div key={dimension} className={styles.dimensionRow}>
					<dt className={styles.dimensionLabel}>
						{DIMENSION_LABELS[dimension]}
					</dt>
					<dd className={styles.dimensionValue}>
						<RatingPills
							value={ratings[dimension]}
							label={DIMENSION_LABELS[dimension]}
						/>
					</dd>
				</div>
			))}
		</dl>
	);
}
