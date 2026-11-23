export type EventCategory = "charla" | "taller" | "conexa";

export type TemsEvent = {
	id: number;
	title: string;
	description: string;
	/** Fecha ISO 8601 con zona horaria (ej. 2026-05-28T18:00:00-05:00). */
	date: string;
	category: EventCategory;
	location: string;
	speaker?: {
		name: string;
		photo?: string;
	};
	url?: string;
};

export type SocialLinks = {
	linkedin?: string;
	email?: string;
};

export type TeamMember = {
	id: number;
	name: string;
	role: string;
	photo?: string;
	social: SocialLinks;
};

export type DivisionColor = "orange" | "blue" | "violet" | "green";

export type Division = {
	id: number;
	title: string;
	subtitle: string;
	color: DivisionColor;
	cta: { text: string; url: string };
	items: { text: string; icon: string }[];
};
