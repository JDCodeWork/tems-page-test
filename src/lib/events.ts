import type { TemsEvent, ThemeColor } from "@/types";
import { exampleEvents } from "./content";
import { fetchCollection, type StrapiMedia, toMedia } from "./strapi";

type StrapiEvent = {
	id: number;
	title: string;
	description: string;
	date: string;
	category?: { name: string; color?: ThemeColor | null } | null;
	location: string;
	speakerName?: string | null;
	speakerPhoto?: StrapiMedia;
	url?: string | null;
};

function mapEvent(event: StrapiEvent): TemsEvent {
	return {
		id: event.id,
		title: event.title,
		description: event.description,
		date: event.date,
		category: event.category
			? { name: event.category.name, color: event.category.color ?? "orange" }
			: undefined,
		location: event.location,
		url: event.url || undefined,
		speaker: event.speakerName
			? {
					name: event.speakerName,
					photo: toMedia(event.speakerPhoto, event.speakerName),
				}
			: undefined,
	};
}

const now = () => new Date().toISOString();
const isUpcoming = (event: TemsEvent) => new Date(event.date) >= new Date();

/** Próximos eventos (desde hoy), ordenados por fecha. */
export async function fetchUpcomingEvents(): Promise<TemsEvent[]> {
	const data = await fetchCollection<StrapiEvent>("events", {
		"filters[date][$gte]": now(),
		sort: "date:asc",
		"populate[speakerPhoto]": "true",
		"populate[category]": "true",
		"pagination[pageSize]": "24",
	});

	if (data === null) {
		return exampleEvents
			.filter(isUpcoming)
			.sort((a, b) => a.date.localeCompare(b.date));
	}
	return data.map(mapEvent);
}

/** Últimos eventos realizados, del más reciente al más antiguo. */
export async function fetchPastEvents(limit = 12): Promise<TemsEvent[]> {
	const data = await fetchCollection<StrapiEvent>("events", {
		"filters[date][$lt]": now(),
		sort: "date:desc",
		"populate[speakerPhoto]": "true",
		"populate[category]": "true",
		"pagination[pageSize]": String(limit),
	});

	if (data === null) {
		return exampleEvents
			.filter((event) => !isUpcoming(event))
			.sort((a, b) => b.date.localeCompare(a.date))
			.slice(0, limit);
	}
	return data.map(mapEvent);
}
