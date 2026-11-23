import type { EventCategory, TemsEvent } from "@/types";
import { upcomingEvents as fallbackEvents } from "./content";
import { fetchCollection, mediaUrl, type StrapiMedia } from "./strapi";

type StrapiEvent = {
	id: number;
	title: string;
	description: string;
	date: string;
	category: EventCategory;
	location: string;
	speakerName?: string | null;
	speakerPhoto?: StrapiMedia;
	url?: string | null;
};

/** Próximos eventos (desde hoy), ordenados por fecha. */
export async function fetchUpcomingEvents(): Promise<TemsEvent[]> {
	const data = await fetchCollection<StrapiEvent>("events", {
		"filters[date][$gte]": new Date().toISOString(),
		sort: "date:asc",
		populate: "speakerPhoto",
		"pagination[pageSize]": "12",
	});

	if (data === null) return fallbackEvents;

	return data.map((event) => ({
		id: event.id,
		title: event.title,
		description: event.description,
		date: event.date,
		category: event.category,
		location: event.location,
		url: event.url ?? undefined,
		speaker: event.speakerName
			? { name: event.speakerName, photo: mediaUrl(event.speakerPhoto) }
			: undefined,
	}));
}
