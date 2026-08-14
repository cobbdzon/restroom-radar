import type { ClientResponse } from "hono/client";
import { hcWithType } from "server/client";

export const client = hcWithType(
	import.meta.env.VITE_SERVER_URL || "http://localhost:3000",
);

export async function fetchJson<T>(
	promise: Promise<ClientResponse<T, number, "json">>,
): Promise<T> {
	const res = await promise;
	if (!res.ok) {
		throw new Error(`Request failed with status ${res.status}`);
	}
	return res.json();
}

export function getHello() {
	return fetchJson(client.hello.$get());
}
