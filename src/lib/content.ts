import type {
	About,
	JoinPage,
	Project,
	SiteSettings,
	TeamMember,
	TemsEvent,
} from "@/types";
import { paragraphs } from "./utils";

/**
 * Contenido de ejemplo. Se usa cuando `STRAPI_URL` no está definido
 * (desarrollo local sin CMS). Ver docs/strapi-consumption.md.
 */
export const exampleEvents: TemsEvent[] = [
	{
		id: 1,
		title: "El futuro de la IA en la ingeniería",
		description:
			"Exploraremos cómo la inteligencia artificial está transformando la ingeniería y la gestión tecnológica.",
		date: "2027-02-25T18:00:00-05:00",
		category: "charla",
		location: "Auditorio 401",
		speaker: { name: "Carlos Ramírez" },
	},
	{
		id: 2,
		title: "Git & GitHub para principiantes",
		description:
			"Aprende a controlar versiones y colaborar en proyectos como un profesional.",
		date: "2027-03-04T14:00:00-05:00",
		category: "taller",
		location: "Laboratorio 2",
		speaker: { name: "Laura Méndez" },
	},
	{
		id: 3,
		title: "Demo Day: Proyectos Conexa",
		description:
			"Conoce los proyectos que nuestros equipos han desarrollado este semestre.",
		date: "2027-03-12T16:00:00-05:00",
		category: "conexa",
		location: "Auditorio 401",
	},
	{
		id: 4,
		title: "Liderazgo en equipos de ingeniería",
		description:
			"Herramientas prácticas para coordinar equipos técnicos y gestionar proyectos.",
		date: "2027-03-19T17:00:00-05:00",
		category: "charla",
		location: "Auditorio 401",
		speaker: { name: "Andrea Torres" },
	},
	{
		id: 5,
		title: "Taller de metodologías ágiles",
		description:
			"Scrum y Kanban aplicados a proyectos estudiantiles, con ejercicios en equipo.",
		date: "2026-10-15T15:00:00-05:00",
		category: "taller",
		location: "Laboratorio 2",
	},
];

export const exampleTeam: TeamMember[] = [
	{ id: 1, name: "Juan Pablo López", role: "Coordinador General", social: {} },
	{
		id: 2,
		name: "María Camila Gil",
		role: "Coordinadora de Learning",
		social: {},
	},
	{
		id: 3,
		name: "Andrés Felipe Díaz",
		role: "Coordinador de Conexa",
		social: {},
	},
	{
		id: 4,
		name: "Sara Valentina M.",
		role: "Coordinadora de Comunicaciones",
		social: {},
	},
	{ id: 5, name: "Nicolás Garzón", role: "Coordinador de Eventos", social: {} },
	{ id: 6, name: "Daniela Ruiz", role: "Coordinadora de Finanzas", social: {} },
];

export const exampleProjects: Project[] = [
	{
		id: 1,
		slug: "learning",
		name: "Learning",
		summary: "Charlas, talleres y espacios de aprendizaje",
		description: paragraphs(
			"Learning reúne los espacios de formación de TEMS UNAL: charlas con invitados de la industria y la academia, talleres prácticos y actividades para aprender jugando.",
			"Buscamos que cualquier estudiante, sin importar su semestre o carrera, encuentre un lugar para desarrollar habilidades técnicas y de gestión que no siempre se ven en clase.",
		),
		color: "orange",
		status: "activo",
		icon: "graduation-cap",
		decoration: "mancha",
		featured: true,
		features: [
			{ text: "Charlas con expertos", icon: "graduation-cap" },
			{ text: "Talleres prácticos", icon: "brain-circuit" },
			{ text: "Juegos de mesa", icon: "shapes" },
			{ text: "Recursos y material de estudio", icon: "library" },
		],
		members: [
			{ ...exampleTeam[1], projectRole: "Líder del proyecto" },
			{ ...exampleTeam[4], projectRole: "Logística de eventos" },
			{ ...exampleTeam[3], projectRole: "Difusión" },
		],
		links: [],
	},
	{
		id: 2,
		slug: "conexa",
		name: "Conexa",
		summary: "Aplicamos la ingeniería a proyectos reales",
		description: paragraphs(
			"Conexa es el espacio donde los equipos de TEMS UNAL llevan la ingeniería a la práctica: proyectos de desarrollo con necesidades reales, trabajo colaborativo y entregas con impacto.",
			"Cada semestre se conforman equipos interdisciplinarios que diseñan, construyen y presentan sus soluciones en el Demo Day.",
		),
		color: "blue",
		status: "activo",
		icon: "monitor-cloud",
		decoration: "anillos",
		featured: true,
		features: [
			{ text: "Proyectos de desarrollo", icon: "monitor-cloud" },
			{ text: "Equipos colaborativos", icon: "users" },
			{ text: "Soluciones innovadoras", icon: "cpu" },
			{ text: "Impacto en la comunidad", icon: "book-user" },
		],
		members: [
			{ ...exampleTeam[2], projectRole: "Líder del proyecto" },
			{ ...exampleTeam[0], projectRole: "Mentor" },
		],
		links: [],
	},
];

export const exampleSettings: SiteSettings = {
	description:
		"Capítulo estudiantil IEEE TEMS de la Universidad Nacional de Colombia. Impulsamos a estudiantes de ingeniería a liderar, aprender y crear soluciones que transformen el futuro.",
	contactEmail: "contacto@ejemplo.com",
	socialLinks: [
		{ network: "instagram", url: "https://instagram.com" },
		{ network: "linkedin", url: "https://linkedin.com" },
		{ network: "email", url: "mailto:contacto@ejemplo.com" },
	],
};

export const exampleAbout: About = {
	title: "Quiénes somos",
	intro:
		"Somos el capítulo estudiantil de la IEEE Technology and Engineering Management Society en la Universidad Nacional de Colombia. Reunimos a estudiantes interesados en la gestión de la tecnología, el liderazgo y la innovación.",
	mission:
		"Formar estudiantes capaces de liderar proyectos tecnológicos con impacto, a través del aprendizaje práctico y el trabajo en equipo.",
	vision:
		"Ser un referente en la universidad por los proyectos y espacios de formación que creamos junto a la comunidad.",
};

export const exampleJoin: JoinPage = {
	intro:
		"No necesitas experiencia previa ni ser de una carrera en particular. Si quieres aprender, proponer ideas y trabajar en equipo, hay un lugar para ti en TEMS UNAL.",
	recruitmentOpen: true,
	recruitmentNote: "Convocatoria abierta todo el semestre",
	whatsappUrl: "https://chat.whatsapp.com/",
	steps: [
		{
			title: "Únete al grupo de WhatsApp",
			description:
				"Ahí compartimos las convocatorias, los eventos y las reuniones abiertas.",
		},
		{
			title: "Asiste a una reunión general",
			description:
				"Conoce al equipo y los proyectos activos. Puedes llegar sin inscribirte.",
		},
		{
			title: "Elige un proyecto",
			description:
				"Habla con la persona encargada de admisiones y elige dónde quieres aportar.",
		},
	],
	contacts: [
		{
			name: "Juan Pablo López",
			role: "Coordinador General",
			email: "contacto@ejemplo.com",
		},
	],
	details: [],
};
