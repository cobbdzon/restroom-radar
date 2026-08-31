import { createFileRoute } from "@tanstack/react-router";
import TopBar from "../components/TopBar";

export const Route = createFileRoute("/contact")({
	head: () => ({
		meta: [{ title: "Contact" }],
	}),
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<TopBar />
			<div>
				<h1>Contact</h1>Reach out to us with feedback or concerns about the restrooms
				on campus.
			</div>
		</>
	);
}
