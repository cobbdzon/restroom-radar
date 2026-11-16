import { useQuery } from "@tanstack/react-query";
import { getRestrooms } from "./api";
import type { Restroom } from "./types";

// Skeleton hook for switching the directory off mock data once the backend lands.
// Not wired into any consumer yet.
export function useServerRestrooms() {
	return useQuery<Restroom[]>({
		queryKey: ["restrooms"],
		queryFn: () => getRestrooms(),
		enabled: false,
	});
}
