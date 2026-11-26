/**
 * Cliente mínimo para la API REST de Strapi v5.
 *
 * Se ejecuta solo en build (sitio estático). Comportamiento:
 * - Sin `STRAPI_URL` → devuelve `null` y la página usa el contenido de
 *   ejemplo (`src/lib/content.ts`). Útil para desarrollo local.
 * - Con `STRAPI_URL` → si Strapi falla, el build falla. Así Netlify
 *   conserva el último deploy bueno en vez de publicar contenido de ejemplo.
 */

import type { Media } from "@/types";

const STRAPI_URL = import.meta.env.STRAPI_URL?.replace(/\/+$/, "");
const STRAPI_TOKEN = import.meta.env.STRAPI_TOKEN;

const TIMEOUT_MS = 20_000;
const RETRIES = 3;

export type StrapiMedia = {
	url: string;
	alternativeText?: string | null;
	width?: number | null;
	height?: number | null;
} | null;

export const isStrapiEnabled = Boolean(STRAPI_URL);

/** Convierte una URL de media de Strapi (`/uploads/x.jpg`) en absoluta. */
export function mediaUrl(media: StrapiMedia | undefined): string | undefined {
	if (!media?.url) return undefined;
	if (/^https?:\/\//.test(media.url)) return media.url;
	return `${STRAPI_URL}${media.url}`;
}

/**
 * Convierte un archivo de Strapi en `Media`. Las imágenes se descargan y
 * optimizan en el build (`astro:assets`), así que el sitio publicado no
 * depende de que Strapi esté encendido.
 */
export function toMedia(
	media: StrapiMedia | undefined,
	fallbackAlt = "",
): Media | undefined {
	const src = mediaUrl(media);
	if (!src || !media) return undefined;
	return {
		src,
		width: media.width ?? 800,
		height: media.height ?? 800,
		alt: media.alternativeText || fallbackAlt,
	};
}

/** Varias páginas piden lo mismo (ej. ajustes del sitio): se pide una sola vez. */
const cache = new Map<string, Promise<unknown>>();

async function request<T>(
	endpoint: string,
	query: Record<string, string>,
): Promise<{ data?: T } | undefined> {
	const url = new URL(`${STRAPI_URL}/api/${endpoint}`);
	for (const [key, value] of Object.entries(query)) {
		url.searchParams.set(key, value);
	}

	const key = url.toString();
	const cached = cache.get(key);
	if (cached) return cached as Promise<{ data?: T } | undefined>;

	const promise = fetchWithRetries<T>(url, endpoint);
	cache.set(key, promise);
	return promise;
}

async function fetchWithRetries<T>(
	url: URL,
	endpoint: string,
): Promise<{ data?: T } | undefined> {
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
			// Single type sin contenido publicado todavía.
			if (response.status === 404) return undefined;
			if (!response.ok) {
				throw new Error(`HTTP ${response.status} ${response.statusText}`);
			}
			return (await response.json()) as { data?: T };
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
	const json = await request<T[]>(endpoint, query);
	return json?.data ?? [];
}

/**
 * Obtiene un single type de Strapi (ej. `about`).
 *
 * @returns El contenido; `{}` si aún no se ha publicado en Strapi (cada
 *   campo cae en su valor por defecto); o `null` si Strapi no está configurado.
 */
export async function fetchSingle<T>(
	endpoint: string,
	query: Record<string, string> = {},
): Promise<Partial<T> | null> {
	if (!STRAPI_URL) return null;
	const json = await request<T>(endpoint, query);
	return json?.data ?? {};
}
