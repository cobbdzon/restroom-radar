import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type Plugin } from "vite";

/**
 * Stand-in for the env-driven og:url so social scrapers never see an empty
 * absolute URL. `transformIndexHtml` swaps in VITE_SITE_URL (no trailing
 * slash) when set, or drops the tag entirely when it isn't.
 */
const SITE_URL_TOKEN = "__SITE_URL__";
const SITE_URL_LINE = new RegExp(
	`^\\s*<meta property="og:url" content="${SITE_URL_TOKEN}" />\\s*$`,
	"m",
);

function injectOgMeta(): Plugin {
	let mode = "production";
	return {
		name: "restroom-radar:og-meta",
		configResolved(config) {
			mode = config.mode;
		},
		transformIndexHtml(html) {
			const env = loadEnv(mode, process.cwd(), "");
			const siteUrl = env.VITE_SITE_URL?.replace(/\/+$/, "");
			if (siteUrl) {
				return html.replaceAll(SITE_URL_TOKEN, siteUrl);
			}
			return html.replace(SITE_URL_LINE, "");
		},
	};
}

export default defineConfig({
	plugins: [
		// Please make sure that '@tanstack/router-plugin' is passed before '@vitejs/plugin-react'
		tanstackRouter({
			target: "react",
			autoCodeSplitting: true,
		}),
		react(),
		injectOgMeta(),
	],
});
