import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: (string | false | null | undefined)[]) {
	return twMerge(clsx(inputs));
}

/** "Proyecto Ñandú 2.0" → "proyecto-nandu-2-0" */
export function slugify(text: string): string {
	return text
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

/** Genera slugs únicos para una lista de nombres (añade -2, -3… si se repiten). */
export function uniqueSlugs(names: string[]): string[] {
	const seen = new Map<string, number>();
	return names.map((name) => {
		const base = slugify(name) || "proyecto";
		const count = (seen.get(base) ?? 0) + 1;
		seen.set(base, count);
		return count === 1 ? base : `${base}-${count}`;
	});
}

/** Convierte texto plano en bloques de párrafo (contenido de ejemplo). */
export function paragraphs(...texts: string[]) {
	return texts.map((text) => ({
		type: "paragraph" as const,
		children: [{ type: "text" as const, text }],
	}));
}

export function isExternal(url: string) {
	return /^https?:\/\//.test(url);
}

/** Aviso para lectores de pantalla en enlaces que abren otra pestaña. */
export const NEW_TAB_HINT = "se abre en una pestaña nueva";

/** Enlaces externos se abren en otra pestaña. */
export function externalProps(url: string) {
	return isExternal(url)
		? { target: "_blank", rel: "noopener noreferrer" }
		: {};
}

/** `aria-label` con el aviso de pestaña nueva si el enlace es externo. */
export function externalLabel(label: string, url: string) {
	return isExternal(url) ? `${label}, ${NEW_TAB_HINT}` : label;
}
