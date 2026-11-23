import type { Division, TeamMember, TemsEvent } from "@/types";

/**
 * Contenido de ejemplo. Se usa cuando `STRAPI_URL` no está definido
 * (desarrollo local sin CMS). Ver docs/strapi-consumption.md.
 */
export const upcomingEvents: TemsEvent[] = [
	{
		id: 1,
		title: "El futuro de la IA en la ingeniería",
		description:
			"Exploraremos cómo la inteligencia artificial está transformando la ingeniería y la gestión tecnológica.",
		date: "2026-05-28T18:00:00-05:00",
		category: "charla",
		location: "Auditorio 401",
		speaker: { name: "Carlos Ramírez" },
	},
	{
		id: 2,
		title: "Git & GitHub para principiantes",
		description:
			"Aprende a controlar versiones y colaborar en proyectos como un profesional.",
		date: "2026-06-07T14:00:00-05:00",
		category: "taller",
		location: "Laboratorio 2",
		speaker: { name: "Laura Méndez" },
	},
	{
		id: 3,
		title: "Demo Day: Proyectos Conexa",
		description:
			"Conoce los proyectos que nuestros equipos han desarrollado este semestre.",
		date: "2026-06-15T16:00:00-05:00",
		category: "conexa",
		location: "Auditorio 401",
	},
	{
		id: 4,
		title: "Liderazgo en equipos de ingeniería",
		description:
			"Herramientas prácticas para coordinar equipos técnicos y gestionar proyectos.",
		date: "2026-06-22T17:00:00-05:00",
		category: "charla",
		location: "Auditorio 401",
		speaker: { name: "Andrea Torres" },
	},
];

export const teamMembers: TeamMember[] = [
	{
		id: 1,
		name: "Juan Pablo López",
		role: "Coordinador General",
		social: { linkedin: "#", email: "#" },
	},
	{
		id: 2,
		name: "María Camila Gil",
		role: "Coordinadora de Learning",
		social: { linkedin: "#", email: "#" },
	},
	{
		id: 3,
		name: "Andrés Felipe Díaz",
		role: "Coordinador de Conexa",
		social: { linkedin: "#", email: "#" },
	},
	{
		id: 4,
		name: "Sara Valentina M.",
		role: "Coordinadora de Comunicaciones",
		social: { linkedin: "#", email: "#" },
	},
	{
		id: 5,
		name: "Nicolás Garzón",
		role: "Coordinador de Eventos",
		social: { linkedin: "#", email: "#" },
	},
	{
		id: 6,
		name: "Daniel Morales",
		role: "Coordinador de Proyectos",
		social: { linkedin: "#", email: "#" },
	},
	{
		id: 7,
		name: "Valeria Rincón",
		role: "Coordinadora de Finanzas",
		social: { linkedin: "#", email: "#" },
	},
];

export const divisions: Division[] = [
	{
		id: 1,
		title: "Learning",
		subtitle: "Charlas, talleres y espacios de aprendizaje",
		color: "orange",
		cta: { text: "Descubre learning", url: "#" },
		items: [
			{ text: "charlas con expertos", icon: "graduation-cap" },
			{ text: "Talleres prácticos", icon: "brain-circuit" },
			{ text: "Juegos de mesa", icon: "shapes" },
			{ text: "Recursos y material de estudio", icon: "library" },
		],
	},
	{
		id: 2,
		title: "Conexa",
		subtitle: "Aplicamos la ingeniería a proyectos reales",
		color: "blue",
		cta: { text: "Explora conexa", url: "#" },
		items: [
			{ text: "Proyectos de desarrollo", icon: "monitor-cloud" },
			{ text: "Equipos Colaborativos", icon: "users" },
			{ text: "Soluciones innovadoras", icon: "cpu" },
			{ text: "Impacto en la comunidad", icon: "book-user" },
		],
	},
];

export const socialLinks = [
	{ name: "Instagram", icon: "instagram", url: "#" },
	{ name: "LinkedIn", icon: "linkedin", url: "#" },
	{ name: "YouTube", icon: "youtube", url: "#" },
	{ name: "Correo", icon: "mail", url: "#" },
];
