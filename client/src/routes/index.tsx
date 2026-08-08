import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { hcWithType } from "server/client";

import styles from "../assets/styles/index.module.css";
import TopBar from "../components/TopBar";

export const Route = createFileRoute("/")({
	component: Index,
});

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

const client = hcWithType(SERVER_URL);

// type ResponseType = Awaited<ReturnType<typeof client.hello.$get>>;

function Index() {
	// const [data, setData] = useState<
	// 	Awaited<ReturnType<ResponseType["json"]>> | undefined
	// >();
	//
	// const { mutate: sendRequest } = useMutation({
	// 	mutationFn: async () => {
	// 		try {
	// 			const res = await client.hello.$get();
	// 			if (!res.ok) {
	// 				console.log("Error fetching data");
	// 				return;
	// 			}
	// 			const data = await res.json();
	// 			setData(data);
	// 		} catch (error) {
	// 			console.log(error);
	// 		}
	// 	},
	// });

	return (
		<>
			<TopBar></TopBar>
			<div>
				<div className={styles.hero}>
					<h1 className={styles.hero_header}>Restroom Radar</h1>
					<span className={styles.hero_description}>
						A handy tool for your excrement expulsion concerns!
					</span>
					<a className={styles.hero_button} href="/directory">
						Start Exploring
					</a>
				</div>
			</div>
		</>
	);
}

export default Index;
