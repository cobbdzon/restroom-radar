import {
	createFileRoute,
	useNavigate,
	useSearch,
} from "@tanstack/react-router";
import { useCallback, useMemo } from "react";
import styles from "../assets/styles/directory.module.css";
import skeletonStyles from "../assets/styles/skeleton.module.css";
import TopBar from "../components/TopBar";
import { DirectoryHeader } from "../features/restrooms/directory/components/DirectoryHeader";
import { DirectoryHero } from "../features/restrooms/directory/components/DirectoryHero";
import { EmptyState } from "../features/restrooms/directory/components/EmptyState";
import { FilterSidebar } from "../features/restrooms/directory/components/FilterSidebar";
import { MobileFilters } from "../features/restrooms/directory/components/MobileFilters";
import { RestroomGrid } from "../features/restrooms/directory/components/RestroomGrid";
import {
	GridSkeleton,
	SidebarSkeleton,
} from "../features/restrooms/directory/components/Skeletons";
import {
	buildingCounts,
	filterAndSort,
	resetFilters,
	tagCounts,
} from "../features/restrooms/directory/directoryLogic";
import {
	type DirectorySearch,
	parseDirectorySearch,
} from "../features/restrooms/directory/searchParams";
import type { Restroom } from "../features/restrooms/types";
import { useDirectoryRestrooms } from "../features/restrooms/useDirectoryRestrooms";

const MAX_SUGGESTIONS = 5;

export const Route = createFileRoute("/directory")({
	validateSearch: parseDirectorySearch,
	head: () => ({
		meta: [{ title: "Directory" }],
	}),
	component: RouteComponent,
});

function buildSuggestions(restrooms: Restroom[], query: string): string[] {
	const needle = query.trim().toLowerCase();
	if (!needle) {
		return [];
	}
	const seen = new Set<string>();
	const suggestions: string[] = [];
	for (const restroom of restrooms) {
		for (const token of [
			restroom.restroomId,
			restroom.name,
			restroom.building,
		]) {
			if (token.toLowerCase().includes(needle) && !seen.has(token)) {
				seen.add(token);
				suggestions.push(token);
			}
		}
		if (suggestions.length >= MAX_SUGGESTIONS) {
			break;
		}
	}
	return suggestions;
}

function RouteComponent() {
	const search = useSearch({ from: Route.id });
	const navigate = useNavigate({ from: Route.id });

	const { data, isPending, isFiltering } = useDirectoryRestrooms(search);

	const results = useMemo(() => filterAndSort(data, search), [data, search]);
	const counts = useMemo(
		() => ({ building: buildingCounts(data), tag: tagCounts(data) }),
		[data],
	);
	const suggestions = useMemo(
		() => buildSuggestions(data, search.q),
		[data, search.q],
	);

	const updateSearch = useCallback(
		(patch: Partial<DirectorySearch>) => {
			navigate({
				search: (prev) => ({ ...prev, ...patch }),
			});
		},
		[navigate],
	);

	const statusMessage = isPending
		? "Loading restrooms"
		: isFiltering
			? "Updating results"
			: "";

	return (
		<>
			<TopBar />
			<main className={styles.page}>
				<DirectoryHero />

				{isPending ? (
					<div className={styles.main}>
						<SidebarSkeleton />
						<div className={styles.results} aria-busy="true">
							<GridSkeleton />
						</div>
					</div>
				) : (
					<div className={styles.main}>
						<FilterSidebar
							search={search}
							counts={counts}
							suggestions={suggestions}
							onChange={updateSearch}
						/>
						<div className={styles.results} aria-busy={isFiltering}>
							<DirectoryHeader
								total={data.length}
								shown={results.length}
								buildingCount={Object.keys(counts.building).length}
							/>
							{isFiltering ? (
								<GridSkeleton />
							) : results.length > 0 ? (
								<RestroomGrid restrooms={results} />
							) : (
								<EmptyState onReset={() => updateSearch(resetFilters())} />
							)}
						</div>
					</div>
				)}

				<p className={skeletonStyles.visuallyHidden} role="status">
					{statusMessage}
				</p>

				{!isPending && (
					<MobileFilters
						search={search}
						counts={counts}
						suggestions={suggestions}
						onChange={updateSearch}
					/>
				)}
			</main>
		</>
	);
}
