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
	{ value: "building-floor", label: "Building and floor" },
	{ value: "highest-rated", label: "Highest rated" },
	{ value: "lowest-rated", label: "Lowest rated" },
	{ value: "name-asc", label: "Room code, A to Z" },
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

/**
 * Build a link payload with only the filters being set. The `/directory`
 * validator fills in the defaults, so links stay short
 * (`/directory?building=Main`) instead of serialising every default.
 */
export function directoryLinkSearch(
	patch: Partial<DirectorySearch> = {},
): DirectorySearch {
	return patch as DirectorySearch;
}

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
		return value.split(",").filter(Boolean);
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
