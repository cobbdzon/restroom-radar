import { Hono } from "hono";
import { cors } from "hono/cors";
import restroomsApp from "./features/restrooms";

export const app = new Hono().use(cors()).route("/restrooms", restroomsApp);

// app.get("/", (c) => {
// 	return c.text("Hello Hono!");
// });
//
// app.get("/hello", async (c) => {
// 	const data: ApiResponse = {
// 		message: "Hello BHVR!",
// 		success: true,
// 	};
//
// 	return c.json(data, { status: 200 });
// });

export default app;
