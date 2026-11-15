import { Hono } from "hono";
import type { Restroom } from "shared";

const app = new Hono().get("/", async (c) => {
	// Seed data lands with the repository; the client still runs on mock data.
	const data: Restroom[] = [];
	return c.json(data, { status: 200 });
});

export default app;
