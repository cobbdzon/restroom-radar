import { createFileRoute } from "@tanstack/react-router";
import TopBar from "../components/TopBar";

export const Route = createFileRoute("/about")({
	head: () => ({
		meta: [{ title: "About" }],
	}),
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<TopBar />
			<div>
				<h1>Restroom Radar</h1>A platform to aggregate reviews on all restrooms
				available in the campus.
			</div>
		</>
	);
}
