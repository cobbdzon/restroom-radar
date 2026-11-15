import type { Gender, RatingDimension, RestroomTag } from "shared";

export {
	BUILDINGS,
	GENDERS,
	RATING_DIMENSIONS,
	RESTROOM_TAGS,
} from "shared";
export type {
	Building,
	Gender,
	RatingDimension,
	Restroom,
	RestroomRatings,
	RestroomTag,
} from "shared";

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
