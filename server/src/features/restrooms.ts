import { Hono } from "hono";
import type { RestroomRepository } from "../db/repository";

export const createRestroomsApp = (repo: RestroomRepository) => {
	const app = new Hono()
		.get("/", async (c) => {
			const data = await repo.list();
			return c.json(data, { status: 200 });
		})
		.get("/:id", async (c) => {
			const id = c.req.param("id");
			const found = await repo.getById(id);
			if (!found) {
				return c.json({ message: "Restroom not found" }, { status: 404 });
			}
			return c.json(found, { status: 200 });
		});

	return app;
};

export default createRestroomsApp;
