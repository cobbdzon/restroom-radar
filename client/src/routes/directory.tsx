import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import TopBar from "../components/TopBar";
import { getRestrooms } from "../features/restrooms/api";

export const Route = createFileRoute("/directory")({
	head: () => ({
		meta: [{ title: "Directory" }],
	}),
	component: RouteComponent,
});

function RouteComponent() {
	const { data, isPending, isError } = useQuery({
		queryKey: ["restrooms"],
		queryFn: getRestrooms,
	});

	if (isPending) {
		return (
			<>
				<TopBar />
				<div>Loading</div>
			</>
		);
	}

	if (isError) {
		return <div>Error!</div>;
	}

	const restroom = data[0];
	if (!restroom) {
		return <div>Error!</div>;
	}

	return (
		<>
			<TopBar />
			<div>
				<span>{restroom.name}</span>
			</div>
		</>
	);
}
