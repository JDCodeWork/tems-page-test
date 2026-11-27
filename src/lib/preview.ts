/**
 * Vista previa de borradores desde Strapi (ver docs/preview.md).
 *
 * El sitio es estático, salvo `/preview`, que se genera en cada visita. El
 * middleware (`src/middleware.ts`) comprueba el secreto y renderiza esa
 * petición dentro de `previewStorage`; así `src/lib/strapi.ts` sabe que debe
 * pedir los borradores sin tener que pasar un parámetro por cada componente.
 */

import { AsyncLocalStorage } from "node:async_hooks";
import { timingSafeEqual } from "node:crypto";

export type PreviewStatus = "draft" | "published";

type PreviewContext = { status: PreviewStatus };

export const previewStorage = new AsyncLocalStorage<PreviewContext>();

/** Datos de la vista previa en curso, o `undefined` en el sitio normal. */
export function previewContext(): PreviewContext | undefined {
	return previewStorage.getStore();
}

/** Compara el secreto recibido con `PREVIEW_SECRET` (sin filtrar su longitud por tiempos). */
export function isValidPreviewSecret(secret: string | null): boolean {
	const expected = process.env.PREVIEW_SECRET ?? import.meta.env.PREVIEW_SECRET;
	if (!expected || !secret) return false;
	const a = Buffer.from(secret);
	const b = Buffer.from(expected);
	return a.length === b.length && timingSafeEqual(a, b);
}
