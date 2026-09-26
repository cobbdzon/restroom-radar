import { Filter, X } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "../../../../assets/styles/directory.module.css";
import { resetFilters } from "../directoryLogic";
import { FilterPanel, type FilterPanelProps } from "./FilterPanel";

export function MobileFilters(props: FilterPanelProps) {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (!open) {
			return;
		}
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setOpen(false);
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [open]);

	return (
		<>
			<button
				type="button"
				className={styles.fab}
				aria-haspopup="dialog"
				aria-expanded={open}
				onClick={() => setOpen(true)}
			>
				<Filter aria-hidden="true" />
				Filters
			</button>
			{open && (
				<div className={styles.drawerLayer}>
					<button
						type="button"
						className={styles.drawerBackdrop}
						aria-label="Close filters"
						onClick={() => setOpen(false)}
					/>
					<div
						role="dialog"
						aria-modal="true"
						aria-label="Filters"
						className={styles.drawer}
					>
						<header className={styles.drawerHeader}>
							<span>Filters</span>
							<button
								type="button"
								className={styles.drawerClose}
								aria-label="Close filters"
								onClick={() => setOpen(false)}
							>
								<X aria-hidden="true" />
							</button>
						</header>
						<div className={styles.drawerBody}>
							<FilterPanel {...props} variant="drawer" />
						</div>
						<footer className={styles.drawerFooter}>
							<button
								type="button"
								className={`${styles.drawerFooterButton} ${styles.drawerFooterSecondary}`}
								onClick={() => props.onChange(resetFilters())}
							>
								Clear all
							</button>
							<button
								type="button"
								className={`${styles.drawerFooterButton} ${styles.drawerFooterPrimary}`}
								onClick={() => setOpen(false)}
							>
								Done
							</button>
						</footer>
					</div>
				</div>
			)}
		</>
	);
}
