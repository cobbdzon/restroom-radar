import type { CSSProperties } from "react";
import styles from "../../../../assets/styles/restroomCard.module.css";
import {
	DIMENSION_LABELS,
	RATING_DIMENSIONS,
	type RestroomRatings,
} from "../../types";

export function DimensionRatings({ ratings }: { ratings: RestroomRatings }) {
	return (
		<dl className={styles.dimensionList}>
			{RATING_DIMENSIONS.map((dimension) => (
				<div key={dimension} className={styles.dimensionRow}>
					<dt className={styles.dimensionLabel}>
						{DIMENSION_LABELS[dimension]}
					</dt>
					<dd className={styles.dimensionValue}>
						<span className={styles.meterTrack} aria-hidden="true">
							<span
								className={styles.meterFill}
								style={
									{
										"--score": `${(ratings[dimension] / 5) * 100}%`,
									} as CSSProperties
								}
							/>
						</span>
						<span className={styles.dimensionScore}>
							{ratings[dimension].toFixed(1)}
						</span>
					</dd>
				</div>
			))}
		</dl>
	);
}
