import type { Building } from "./types";

/**
 * Fixed colours from the campus map legend. Each building keeps one colour
 * wherever it appears — quick-find rows, filter chips, and door plates — so
 * the directory can be scanned by place as well as by name.
 */
export const BUILDING_META: Record<
	Building,
	{ label: string; color: string; short: string }
> = {
	Main: { label: "Main Building", short: "Main", color: "#a6192e" },
	North: { label: "North Building", short: "North", color: "#2b5b84" },
	South: { label: "South Building", short: "South", color: "#8c5e00" },
	West: { label: "West Building", short: "West", color: "#2f6b4f" },
};
