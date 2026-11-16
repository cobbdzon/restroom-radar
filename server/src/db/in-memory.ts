import type { Restroom } from "shared";
import type { NewRestroom, RestroomRepository } from "./repository";

export class InMemoryRestroomRepository implements RestroomRepository {
	private readonly store = new Map<string, Restroom>();

	constructor(seed: NewRestroom[] = []) {
		for (const item of seed) {
			this.store.set(item.restroomId, structuredClone(item));
		}
	}

	async list(): Promise<Restroom[]> {
		return [...this.store.values()].map((r) => structuredClone(r));
	}

	async getById(restroomId: string): Promise<Restroom | undefined> {
		const found = this.store.get(restroomId);
		return found ? structuredClone(found) : undefined;
	}

	async create(input: NewRestroom): Promise<Restroom> {
		if (this.store.has(input.restroomId)) {
			throw new Error(`Restroom already exists: ${input.restroomId}`);
		}
		const copy = structuredClone(input);
		this.store.set(copy.restroomId, copy);
		return structuredClone(copy);
	}
}
