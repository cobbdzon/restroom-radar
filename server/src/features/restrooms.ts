import { Hono } from "hono";
import type { Restroom } from "shared";

const app = new Hono().get("/", async (c) => {
	const data: Restroom = {
		restroomId: 1,
		name: "Great Farticus",
	};
	return c.json([data], { status: 200 });
});

export default app;
