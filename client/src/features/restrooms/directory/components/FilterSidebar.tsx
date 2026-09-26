import { Filter } from "lucide-react";
import styles from "../../../../assets/styles/filterSidebar.module.css";
import { FilterPanel, type FilterPanelProps } from "./FilterPanel";

export function FilterSidebar(props: FilterPanelProps) {
	return (
		<aside className={styles.sidebar} aria-label="Filters">
			<header className={styles.sidebarHeader}>
				<Filter aria-hidden="true" />
				<span>Filters</span>
			</header>
			<FilterPanel {...props} />
		</aside>
	);
}
