import { useEffect, useRef, useState } from "react";
import type { DirectorySearch } from "./directory/searchParams";
import { MOCK_RESTROOMS } from "./mock";
import type { Restroom } from "./types";

const INITIAL_LOAD_MS = 600;
const FILTER_DEBOUNCE_MS = 250;

export type UseDirectoryRestroomsResult = {
	data: Restroom[];
	isPending: boolean;
	isFiltering: boolean;
};

/**
 * Simulated restroom directory data source.
 *
 * Currently backed by the client-side mock. When the backend Step 1 lands,
 * swap the internals for the typed `getRestrooms()` client while keeping the
 * same `{ data, isPending, isFiltering }` shape — no consumer changes needed.
 */
export function useDirectoryRestrooms(
	search: DirectorySearch,
): UseDirectoryRestroomsResult {
	const [isPending, setIsPending] = useState(true);
	const [isFiltering, setIsFiltering] = useState(false);
	const loadedRef = useRef(false);
	const queryKey = JSON.stringify(search);

	useEffect(() => {
		const timer = setTimeout(() => {
			loadedRef.current = true;
			setIsPending(false);
		}, INITIAL_LOAD_MS);
		return () => clearTimeout(timer);
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: queryKey is only a re-run trigger, not read here
	useEffect(() => {
		if (!loadedRef.current) {
			return;
		}
		setIsFiltering(true);
		const timer = setTimeout(() => setIsFiltering(false), FILTER_DEBOUNCE_MS);
		return () => clearTimeout(timer);
	}, [queryKey]);

	return { data: MOCK_RESTROOMS, isPending, isFiltering };
}
