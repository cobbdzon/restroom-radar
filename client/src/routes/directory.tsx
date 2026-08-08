import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/directory")({
	head: () => ({
		meta: [{ title: "Directory" }],
	}),
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/directory"!</div>;
}
