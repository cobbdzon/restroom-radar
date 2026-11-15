import { MapPin } from "lucide-react";
import styles from "../../../../assets/styles/directory.module.css";

type DirectoryHeaderProps = {
	/** Null while the first load is in flight. */
	total: number | null;
	buildingCount: number;
};

export function DirectoryHeader({
	total,
	buildingCount,
}: DirectoryHeaderProps) {
	return (
		<header className={styles.pageHeader}>
			<div className={styles.pageHeaderInner}>
				<p className={styles.place}>
					<MapPin aria-hidden="true" />
					Mapúa Intramuros
				</p>
				<div className={styles.headerRow}>
					<h1 className={styles.title}>Restroom directory</h1>
					<p className={styles.headerStatus}>
						{total === null
							? "Loading restrooms"
							: `${total} restrooms, ${buildingCount} buildings`}
					</p>
				</div>
				<p className={styles.subtitle}>
					Filter by building, gender, amenities, or rating. Every listing shows
					the floor, stall count, and PWD access.
				</p>
			</div>
		</header>
	);
}
