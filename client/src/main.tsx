import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import "./assets/styles/main.css";

const queryClient = new QueryClient();

import { routeTree } from "./routeTree.gen";

const router = createRouter({
	routeTree,
	// Keep shareable directory links short: arrays become comma-separated
	// values instead of JSON, and `/directory` defaults never hit the URL.
	parseSearch: (searchStr) => {
		const params = new URLSearchParams(searchStr);
		const search: Record<string, string | string[]> = {};
		for (const key of new Set(params.keys())) {
			const values = params.getAll(key);
			search[key] = values.length > 1 ? values : values[0];
		}
		return search;
	},
	stringifySearch: (search) => {
		const params = new URLSearchParams();
		for (const [key, value] of Object.entries(search)) {
			if (value === undefined || value === null || value === "") {
				continue;
			}
			if (Array.isArray(value)) {
				if (value.length === 0) {
					continue;
				}
				params.set(key, value.join(","));
				continue;
			}
			params.set(key, String(value));
		}
		const query = params.toString();
		return query ? `?${query}` : "";
	},
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const rootElement = document.getElementById("root");
if (!rootElement) {
	throw new Error(
		"Root element not found. Check if it's in your index.html or if the id is correct.",
	);
}

if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
			</QueryClientProvider>
		</StrictMode>,
	);
}
