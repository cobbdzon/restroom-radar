import { hcWithType } from "server/client";

export const client = hcWithType(
	import.meta.env.VITE_SERVER_URL || "http://localhost:3000",
);

type JsonResponse<T> = {
	ok: boolean;
	status: number;
	json: () => Promise<T>;
};

export async function fetchJson<T>(
	promise: Promise<JsonResponse<T>>,
): Promise<T> {
	const res = await promise;
	if (!res.ok) {
		throw new Error(`Request failed with status ${res.status}`);
	}
	return res.json();
}
