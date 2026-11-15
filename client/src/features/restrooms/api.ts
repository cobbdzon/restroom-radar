import { client, fetchJson } from "../../lib/client";

export function getRestrooms() {
	return fetchJson(client.restrooms.$get());
}
