import {
	BUILDINGS,
	type Building,
	GENDERS,
	type Gender,
	RESTROOM_TAGS,
	type RestroomTag,
} from "../types";

export type SortKey =
	| "highest-rated"
	| "lowest-rated"
	| "name-asc"
	| "building-floor";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
	{ value: "highest-rated", label: "Highest Rated" },
	{ value: "lowest-rated", label: "Lowest Rated" },
	{ value: "name-asc", label: "Name (A to Z)" },
	{ value: "building-floor", label: "Building & Floor" },
];

export type GenderFilter = "all" | Gender;

export type MinRating = 1 | 2 | 3 | 4 | 5;

export type DirectorySearch = {
	q: string;
	sort: SortKey;
	building: Building[];
	gender: GenderFilter;
	pwd: boolean;
	tags: RestroomTag[];
	minRating: MinRating;
};

export const DEFAULT_DIRECTORY_SEARCH: DirectorySearch = {
	q: "",
	sort: "building-floor",
	building: [],
	gender: "all",
	pwd: false,
	tags: [],
	minRating: 1,
};

const SORT_KEYS: SortKey[] = [
	"highest-rated",
	"lowest-rated",
	"name-asc",
	"building-floor",
];
const GENDER_FILTERS: GenderFilter[] = ["all", ...GENDERS];
const MIN_RATING_VALUES: MinRating[] = [1, 2, 3, 4, 5];

function toStringList(value: unknown): string[] {
	if (typeof value === "string") {
		return value ? [value] : [];
	}
	if (Array.isArray(value)) {
		return value.filter((item): item is string => typeof item === "string");
	}
	return [];
}

function parseBuildings(value: unknown): Building[] {
	return toStringList(value).filter((item): item is Building =>
		(BUILDINGS as readonly string[]).includes(item),
	);
}

function parseTags(value: unknown): RestroomTag[] {
	return toStringList(value).filter((item): item is RestroomTag =>
		(RESTROOM_TAGS as readonly string[]).includes(item),
	);
}

export function parseDirectorySearch(
	search: Record<string, unknown>,
): DirectorySearch {
	const minRating = Number(search.minRating);
	return {
		q: typeof search.q === "string" ? search.q : DEFAULT_DIRECTORY_SEARCH.q,
		sort: SORT_KEYS.includes(search.sort as SortKey)
			? (search.sort as SortKey)
			: DEFAULT_DIRECTORY_SEARCH.sort,
		building: parseBuildings(search.building),
		gender: GENDER_FILTERS.includes(search.gender as GenderFilter)
			? (search.gender as GenderFilter)
			: DEFAULT_DIRECTORY_SEARCH.gender,
		pwd: search.pwd === true || search.pwd === "true" || search.pwd === "1",
		tags: parseTags(search.tags),
		minRating: MIN_RATING_VALUES.includes(minRating as MinRating)
			? (minRating as MinRating)
			: DEFAULT_DIRECTORY_SEARCH.minRating,
	};
}
