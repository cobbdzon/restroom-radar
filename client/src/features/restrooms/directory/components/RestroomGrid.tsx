import styles from "../../../../assets/styles/directory.module.css";
import type { Restroom } from "../../types";
import { RestroomCard } from "./RestroomCard";

export function RestroomGrid({ restrooms }: { restrooms: Restroom[] }) {
	return (
		<div className={styles.grid}>
			{restrooms.map((restroom) => (
				<RestroomCard key={restroom.restroomId} restroom={restroom} />
			))}
		</div>
	);
}
