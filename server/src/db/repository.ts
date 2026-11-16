import type { Restroom } from "shared";

export type NewRestroom = Restroom;

export interface RestroomRepository {
	list(): Promise<Restroom[]>;
	getById(restroomId: string): Promise<Restroom | undefined>;
	create(input: NewRestroom): Promise<Restroom>;
}
