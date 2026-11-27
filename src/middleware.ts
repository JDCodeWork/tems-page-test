import { defineMiddleware } from "astro:middleware";
import {
	isValidPreviewSecret,
	type PreviewStatus,
	previewStorage,
} from "@/lib/preview";

/**
 * Protege `/preview` (vista previa de borradores desde el admin de Strapi).
 * El resto del sitio es estático y pasa sin cambios.
 */
export const onRequest = defineMiddleware(async (context, next) => {
	if (!context.url.pathname.replace(/\/+$/, "").endsWith("/preview")) {
		return next();
	}

	const params = context.url.searchParams;
	if (!isValidPreviewSecret(params.get("secret"))) {
		return new Response("Vista previa no autorizada.", {
			status: 401,
			headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
		});
	}

	const status: PreviewStatus =
		params.get("status") === "published" ? "published" : "draft";

	// Se genera toda la página dentro del contexto de vista previa, para que
	// cada petición a Strapi (incluidas las de los componentes) pida borradores.
	return previewStorage.run({ status }, async () => {
		const response = await next();
		const html = await response.text();

		const headers = new Headers(response.headers);
		headers.set("Cache-Control", "private, no-store");
		headers.set("X-Robots-Tag", "noindex");
		// Solo el admin de Strapi puede mostrar la vista previa en un iframe.
		const strapiUrl = process.env.STRAPI_URL ?? import.meta.env.STRAPI_URL;
		const strapiOrigin = strapiUrl ? new URL(strapiUrl).origin : "";
		headers.set(
			"Content-Security-Policy",
			`frame-ancestors 'self' ${strapiOrigin}`.trim(),
		);

		return new Response(html, { status: response.status, headers });
	});
});
