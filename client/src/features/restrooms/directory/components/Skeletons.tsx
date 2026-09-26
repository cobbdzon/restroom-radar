import styles from "../../../../assets/styles/skeleton.module.css";

const SKELETON_CARD_KEYS = Array.from(
	{ length: 12 },
	(_, index) => `skeleton-card-${index}`,
);

export function SidebarSkeleton() {
	return (
		<div className={styles.sidebarSkeleton} aria-hidden="true">
			<div className={styles.skeletonHeader} />
			<div className={styles.skeletonLabel} />
			<div className={styles.skeletonBlock} />
			<div className={styles.skeletonLabel} />
			<div className={styles.skeletonBlock} />
			<div className={styles.skeletonPills}>
				<span className={styles.skeletonPill} />
				<span className={styles.skeletonPill} />
				<span className={styles.skeletonPill} />
			</div>
			<div className={styles.skeletonLabel} />
			<div className={styles.skeletonPills}>
				<span className={styles.skeletonPill} />
				<span className={styles.skeletonPill} />
			</div>
			<div className={styles.skeletonLabel} />
			<div className={styles.skeletonSlider} />
		</div>
	);
}

export function GridSkeleton({ count = 4 }: { count?: number }) {
	const keys = SKELETON_CARD_KEYS.slice(0, count);
	return (
		<div className={styles.gridSkeleton} aria-hidden="true">
			{keys.map((key) => (
				<div key={key} className={styles.skeletonCard}>
					<div className={styles.skeletonCardTop} />
					<div className={styles.skeletonLine} />
					<div className={styles.skeletonLine} />
					<div className={styles.skeletonLine} />
					<div className={styles.skeletonCardBottom} />
				</div>
			))}
		</div>
	);
}
