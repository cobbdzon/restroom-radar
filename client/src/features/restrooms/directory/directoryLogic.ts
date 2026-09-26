import { BUILDINGS, type Restroom } from "../types";
import type { DirectorySearch, SortKey } from "./searchParams";

const BUILDING_ORDER: Record<string, number> = Object.fromEntries(
	BUILDINGS.map((building, index) => [building, index]),
);

export function overallRating(restroom: Restroom): number {
	if (restroom.ratings === null) {
		return 0;
	}
	const values = Object.values(restroom.ratings);
	return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function matchesQuery(restroom: Restroom, query: string): boolean {
	const needle = query.trim().toLowerCase();
	if (!needle) {
		return true;
	}
	const haystack = [
		restroom.restroomId,
		restroom.name,
		restroom.building,
		String(restroom.floor),
		restroom.gender,
		...restroom.tags,
	]
		.join(" ")
		.toLowerCase();
	return haystack.includes(needle);
}

export function applyFilters(
	restrooms: Restroom[],
	search: DirectorySearch,
): Restroom[] {
	const selectedBuildings = new Set(search.building);
	const selectedTags = new Set(search.tags);
	return restrooms.filter((restroom) => {
		if (!matchesQuery(restroom, search.q)) {
			return false;
		}
		if (search.gender !== "all" && restroom.gender !== search.gender) {
			return false;
		}
		if (search.pwd && !restroom.pwdAccessible) {
			return false;
		}
		if (
			selectedBuildings.size > 0 &&
			!selectedBuildings.has(restroom.building)
		) {
			return false;
		}
		if (
			selectedTags.size > 0 &&
			![...selectedTags].every((tag) => restroom.tags.includes(tag))
		) {
			return false;
		}
		if (
			search.minRating > 1 &&
			(restroom.ratings === null || overallRating(restroom) < search.minRating)
		) {
			return false;
		}
		return true;
	});
}

export function sortRestrooms(
	restrooms: Restroom[],
	sort: SortKey,
): Restroom[] {
	const copy = [...restrooms];
	switch (sort) {
		case "highest-rated":
			copy.sort((a, b) => {
				if (a.ratings === null && b.ratings === null) {
					return a.restroomId.localeCompare(b.restroomId);
				}
				if (a.ratings === null) {
					return 1;
				}
				if (b.ratings === null) {
					return -1;
				}
				return (
					overallRating(b) - overallRating(a) ||
					a.restroomId.localeCompare(b.restroomId)
				);
			});
			break;
		case "lowest-rated":
			copy.sort((a, b) => {
				if (a.ratings === null && b.ratings === null) {
					return a.restroomId.localeCompare(b.restroomId);
				}
				if (a.ratings === null) {
					return 1;
				}
				if (b.ratings === null) {
					return -1;
				}
				return (
					overallRating(a) - overallRating(b) ||
					a.restroomId.localeCompare(b.restroomId)
				);
			});
			break;
		case "name-asc":
			copy.sort((a, b) => a.restroomId.localeCompare(b.restroomId));
			break;
		case "building-floor":
			copy.sort(
				(a, b) =>
					BUILDING_ORDER[a.building] - BUILDING_ORDER[b.building] ||
					a.floor - b.floor ||
					a.restroomId.localeCompare(b.restroomId),
			);
			break;
	}
	return copy;
}

export function filterAndSort(
	restrooms: Restroom[],
	search: DirectorySearch,
): Restroom[] {
	return sortRestrooms(applyFilters(restrooms, search), search.sort);
}

type Counts = Record<string, number>;

function countBy<T>(items: T[], key: (item: T) => string): Counts {
	const counts: Counts = {};
	for (const item of items) {
		const k = key(item);
		counts[k] = (counts[k] ?? 0) + 1;
	}
	return counts;
}

export function buildingCounts(restrooms: Restroom[]): Counts {
	return countBy(restrooms, (restroom) => restroom.building);
}

export function tagCounts(restrooms: Restroom[]): Counts {
	return countBy(
		restrooms.flatMap((restroom) => restroom.tags),
		(tag) => tag,
	);
}

export function isFilterActive(search: DirectorySearch): boolean {
	return (
		search.q.trim() !== "" ||
		search.gender !== "all" ||
		search.pwd ||
		search.building.length > 0 ||
		search.tags.length > 0 ||
		search.minRating > 1
	);
}

export function resetFilters(): Pick<
	DirectorySearch,
	"q" | "building" | "gender" | "pwd" | "tags" | "minRating"
> {
	return {
		q: "",
		building: [],
		gender: "all",
		pwd: false,
		tags: [],
		minRating: 1,
	};
}
