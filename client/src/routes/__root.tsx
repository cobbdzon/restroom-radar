import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1.0" },
			{ title: "Restroom Radar" },
		],
		links: [{ rel: "icon", href: "/vite.svg" }],
	}),
	component: () => (
		<>
			<HeadContent />
			<Outlet />
			<TanStackRouterDevtools />
		</>
	),
});
