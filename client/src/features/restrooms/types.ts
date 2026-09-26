export const BUILDINGS = ["Main", "North", "South", "West"] as const;
export type Building = (typeof BUILDINGS)[number];

export const GENDERS = ["male", "female", "all-gender"] as const;
export type Gender = (typeof GENDERS)[number];

export const RESTROOM_TAGS = [
	"soapPump",
	"vending",
	"bidet",
	"seatCover",
] as const;
export type RestroomTag = (typeof RESTROOM_TAGS)[number];

export const RATING_DIMENSIONS = [
	"cleanliness",
	"smell",
	"privacy",
	"comfort",
	"accessibility",
] as const;
export type RatingDimension = (typeof RATING_DIMENSIONS)[number];

export type RestroomRatings = Record<RatingDimension, number>;

export type Restroom = {
	restroomId: string;
	name: string;
	building: Building;
	floor: number;
	gender: Gender;
	pwdAccessible: boolean;
	tags: RestroomTag[];
	stallCount: number;
	/** Per-dimension ratings from student reviews; null when no reviews exist. */
	ratings: RestroomRatings | null;
	reviewCount: number;
};

export const GENDER_LABELS: Record<Gender, string> = {
	male: "Men's",
	female: "Women's",
	"all-gender": "All-Gender",
};

export const TAG_LABELS: Record<RestroomTag, string> = {
	soapPump: "Soap pump",
	vending: "Vending machine",
	bidet: "Bidet",
	seatCover: "Seat covers",
};

export const DIMENSION_LABELS: Record<RatingDimension, string> = {
	cleanliness: "Cleanliness",
	smell: "Smell",
	privacy: "Privacy",
	comfort: "Comfort",
	accessibility: "Accessibility",
};
