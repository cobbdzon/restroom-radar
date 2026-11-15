import { SearchX } from "lucide-react";
import styles from "../../../../assets/styles/directory.module.css";

export function EmptyState({ onReset }: { onReset: () => void }) {
	return (
		<div className={styles.emptyState}>
			<span className={styles.emptyIcon} aria-hidden="true">
				<SearchX />
			</span>
			<h3 className={styles.emptyTitle}>No restrooms match that.</h3>
			<p className={styles.emptyText}>
				Try removing a filter, or search for a building name instead.
			</p>
			<button type="button" className={styles.emptyReset} onClick={onReset}>
				Clear filters
			</button>
		</div>
	);
}
