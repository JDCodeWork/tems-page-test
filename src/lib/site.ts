import type { About, Block, JoinPage, SiteSettings } from "@/types";
import { exampleAbout, exampleJoin, exampleSettings } from "./content";
import { fetchSingle } from "./strapi";

export const SITE_NAME = "IEEE TEMS UNAL";

const DEFAULT_DESCRIPTION = exampleSettings.description;

/** Ajustes generales del sitio (descripción, correo, redes). */
export async function fetchSiteSettings(): Promise<SiteSettings> {
	const data = await fetchSingle<SiteSettings>("site-setting", {
		populate: "socialLinks",
	});
	if (data === null) return exampleSettings;

	return {
		description: data.description || DEFAULT_DESCRIPTION,
		contactEmail: data.contactEmail || undefined,
		socialLinks: data.socialLinks ?? [],
	};
}

/** Sección "Nosotros". */
export async function fetchAbout(): Promise<About> {
	const data = await fetchSingle<About>("about");
	if (data === null) return exampleAbout;

	return {
		title: data.title || "Quiénes somos",
		intro: data.intro || DEFAULT_DESCRIPTION,
		mission: data.mission || undefined,
		vision: data.vision || undefined,
	};
}

type StrapiJoinPage = Omit<JoinPage, "details"> & { details?: Block[] | null };

/** Página "Únete". */
export async function fetchJoinPage(): Promise<JoinPage> {
	const data = await fetchSingle<StrapiJoinPage>("join-page", {
		"populate[steps]": "true",
		"populate[contacts]": "true",
	});
	if (data === null) return exampleJoin;

	return {
		intro:
			data.intro ||
			"Escríbenos y te contamos cómo hacer parte de TEMS UNAL.",
		recruitmentOpen: data.recruitmentOpen !== false,
		recruitmentNote: data.recruitmentNote || undefined,
		whatsappUrl: data.whatsappUrl || undefined,
		steps: data.steps ?? [],
		contacts: data.contacts ?? [],
		details: data.details ?? [],
	};
}
