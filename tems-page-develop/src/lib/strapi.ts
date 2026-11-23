/**
 * Cliente mínimo para la API REST de Strapi v5.
 *
 * Se ejecuta solo en build (sitio estático). Comportamiento:
 * - Sin `STRAPI_URL` → devuelve `null` y la página usa el contenido de
 *   ejemplo (`src/lib/content.ts`). Útil para desarrollo local.
 * - Con `STRAPI_URL` → si Strapi falla, el build falla. Así Netlify
 *   conserva el último deploy bueno en vez de publicar contenido de ejemplo.
 */

const STRAPI_URL = import.meta.env.STRAPI_URL?.replace(/\/+$/, "");
const STRAPI_TOKEN = import.meta.env.STRAPI_TOKEN;

const TIMEOUT_MS = 20_000;
const RETRIES = 3;

export type StrapiMedia = {
	url: string;
	alternativeText?: string | null;
} | null;

export const isStrapiEnabled = Boolean(STRAPI_URL);

/** Convierte una URL de media de Strapi (`/uploads/x.jpg`) en absoluta. */
export function mediaUrl(media: StrapiMedia | undefined): string | undefined {
	if (!media?.url) return undefined;
	if (/^https?:\/\//.test(media.url)) return media.url;
	return `${STRAPI_URL}${media.url}`;
}

/**
 * Obtiene una colección de Strapi.
 *
 * @param endpoint Nombre plural de la colección (ej. `events`).
 * @param query Parámetros de Strapi (filters, sort, populate…).
 * @returns Los elementos, o `null` si Strapi no está configurado.
 */
export async function fetchCollection<T>(
	endpoint: string,
	query: Record<string, string> = {},
): Promise<T[] | null> {
	if (!STRAPI_URL) return null;

	const url = new URL(`${STRAPI_URL}/api/${endpoint}`);
	for (const [key, value] of Object.entries(query)) {
		url.searchParams.set(key, value);
	}

	const headers: HeadersInit = { Accept: "application/json" };
	if (STRAPI_TOKEN) headers.Authorization = `Bearer ${STRAPI_TOKEN}`;

	let lastError: unknown;
	// Reintentos: los hostings gratuitos (Render, Railway…) tardan en "despertar".
	for (let attempt = 1; attempt <= RETRIES; attempt++) {
		try {
			const response = await fetch(url, {
				headers,
				signal: AbortSignal.timeout(TIMEOUT_MS),
			});
			if (!response.ok) {
				throw new Error(`HTTP ${response.status} ${response.statusText}`);
			}
			const json = (await response.json()) as { data?: T[] };
			return json.data ?? [];
		} catch (error) {
			lastError = error;
			if (attempt < RETRIES) {
				await new Promise((resolve) => setTimeout(resolve, attempt * 3_000));
			}
		}
	}

	throw new Error(
		`[strapi] No se pudo obtener "${endpoint}" desde ${url.origin}: ${String(lastError)}`,
	);
}
