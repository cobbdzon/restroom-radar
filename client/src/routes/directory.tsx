import { createFileRoute } from "@tanstack/react-router";
import TopBar from "../components/TopBar";

export const Route = createFileRoute("/directory")({
	head: () => ({
		meta: [{ title: "Directory" }],
	}),
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<TopBar />
			<div>Hello "/directory"!</div>
		</>
	);
}
