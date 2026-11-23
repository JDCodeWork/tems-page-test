// @ts-check
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import tsconfigPaths from "vite-tsconfig-paths";

// https://astro.build/config
export default defineConfig({
	vite: {
		server: {
			watch: {
				usePolling: true,
			},
			host: true,
		},

		plugins: [tsconfigPaths(), tailwindcss()],
	},
});
