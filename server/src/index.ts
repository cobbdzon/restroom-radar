import { Hono } from "hono";
import { cors } from "hono/cors";
import { seedRestrooms } from "./db/data/restrooms";
import { InMemoryRestroomRepository } from "./db/in-memory";
import { createRestroomsApp } from "./features/restrooms";

// Composition root. When DATABASE_URL is set, swap in the Postgres repo (Step 2).
const repo = new InMemoryRestroomRepository(seedRestrooms);

export const app = new Hono()
	.use(cors())
	.route("/restrooms", createRestroomsApp(repo));

export default app;
