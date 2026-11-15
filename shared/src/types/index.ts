export type ApiResponse = {
	message: string;
	success: true;
};

/**
 * Fixed Mapúa Intramuros building taxonomy.
 * Maps to a `buildings` lookup table (code + name).
 */
export const BUILDINGS = ["Main", "North", "South", "West"] as const;
export type Building = (typeof BUILDINGS)[number];

/** Maps to a Postgres `gender` enum. */
export const GENDERS = ["male", "female", "all-gender"] as const;
export type Gender = (typeof GENDERS)[number];

/** Maps to a Postgres `tag` enum array on `restrooms`. */
export const RESTROOM_TAGS = [
	"soapPump",
	"vending",
	"bidet",
	"seatCover",
] as const;
export type RestroomTag = (typeof RESTROOM_TAGS)[number];

/** Each value is a 1–5 rating in 0.5 steps. */
export const RATING_DIMENSIONS = [
	"cleanliness",
	"smell",
	"privacy",
	"comfort",
	"accessibility",
] as const;
export type RatingDimension = (typeof RATING_DIMENSIONS)[number];

export type RestroomRatings = Record<RatingDimension, number>;

/**
 * Storage-independent read model for one restroom.
 *
 * `restroomId` is the natural key (campus code such as "WM301"), so no
 * auto-increment id leaks into the API. The enum unions map to Postgres enums,
 * and the aggregate fields are derived from related rows rather than stored
 * on the restroom itself.
 */
export type Restroom = {
	/** Natural primary key: campus code such as "WM301". */
	restroomId: string;
	name: string;
	building: Building;
	/** Campus floor, 1–6. */
	floor: number;
	gender: Gender;
	isPwdAccessible: boolean;
	tags: RestroomTag[];
	/** Derived from the restroom's stalls. */
	stallCount: number;
	/** Aggregate of student reviews; null when there are none. */
	ratings: RestroomRatings | null;
	/** Derived from the restroom's reviews. */
	reviewCount: number;
};
