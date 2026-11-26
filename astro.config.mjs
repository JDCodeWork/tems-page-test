// @ts-check
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import tsconfigPaths from "vite-tsconfig-paths";

// Lee `.env` si existe (en Netlify las variables ya vienen en el entorno).
try {
	process.loadEnvFile();
} catch {}
const env = process.env;

/**
 * URL pública del sitio (canonical, Open Graph, sitemap).
 * `SITE_URL` tiene prioridad; si no, Netlify define `URL` en cada build.
 */
const site = env.SITE_URL || env.URL || "http://localhost:4321";

/** Hosts desde los que Astro puede descargar y optimizar imágenes en el build. */
const remotePatterns = [{ protocol: "https", hostname: "res.cloudinary.com" }];
if (env.STRAPI_URL) {
	const { protocol, hostname } = new URL(env.STRAPI_URL);
	remotePatterns.push({ protocol: protocol.replace(":", ""), hostname });
}

// https://astro.build/config
export default defineConfig({
	site,
	integrations: [sitemap()],
	image: { remotePatterns },
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
