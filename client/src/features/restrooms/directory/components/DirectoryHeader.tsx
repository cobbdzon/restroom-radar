import { MapPin, Plus } from "lucide-react";
import styles from "../../../../assets/styles/directory.module.css";

type DirectoryHeaderProps = {
	total: number;
	shown: number;
	buildingCount: number;
};

export function DirectoryHeader({
	total,
	shown,
	buildingCount,
}: DirectoryHeaderProps) {
	return (
		<header className={styles.directoryHeader}>
			<div className={styles.directoryTitleGroup}>
				<span className={styles.directoryIcon} aria-hidden="true">
					<MapPin />
				</span>
				<div>
					<h2 className={styles.directoryTitle}>Directory</h2>
					<p className={styles.directorySubtitle}>
						{total} restrooms across {buildingCount} buildings
					</p>
				</div>
			</div>
			<div className={styles.directoryActions}>
				<span className={styles.resultCount}>
					Showing {shown} of {total}
				</span>
				<button type="button" className={styles.ctaButton} disabled>
					<Plus aria-hidden="true" />
					Suggest a restroom
				</button>
			</div>
		</header>
	);
}
