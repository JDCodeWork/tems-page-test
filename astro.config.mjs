// @ts-check
import netlify from "@astrojs/netlify";
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
	// Todo el sitio se genera en el build (estático). Solo `/preview` (vista
	// previa de borradores desde Strapi) se genera en cada visita, como función
	// de Netlify. Ver docs/preview.md.
	// En `astro dev` no se emulan las Edge Functions de Netlify (el sitio no las usa).
	adapter: netlify({ devFeatures: { edgeFunctions: false } }),
	integrations: [
		sitemap({ filter: (page) => !new URL(page).pathname.startsWith("/preview") }),
	],
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
