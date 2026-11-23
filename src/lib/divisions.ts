import type { Division, DivisionColor } from "@/types";
import { divisions as fallbackDivisions } from "./content";
import { fetchCollection } from "./strapi";

type StrapiDivision = {
	id: number;
	title: string;
	subtitle: string;
	color: DivisionColor;
	ctaText: string;
	ctaUrl: string;
	items?: { text: string; icon: string }[];
};

export async function fetchDivisions(): Promise<Division[]> {
	const data = await fetchCollection<StrapiDivision>("divisions", {
		sort: "order:asc",
		populate: "items",
	});

	if (data === null) return fallbackDivisions;

	return data.map((division) => ({
		id: division.id,
		title: division.title,
		subtitle: division.subtitle,
		color: division.color,
		cta: { text: division.ctaText, url: division.ctaUrl },
		items: division.items ?? [],
	}));
}
