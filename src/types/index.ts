/** Imagen ya resuelta (URL absoluta + dimensiones para `astro:assets`). */
export type Media = {
	src: string;
	width: number;
	height: number;
	alt: string;
};

/** Colores de la paleta que se pueden elegir en Strapi (proyectos y categorías de eventos). */
export type ThemeColor = "orange" | "blue" | "violet" | "green";

/** Categoría de evento. Las crea el Super Admin en Strapi (colección Event Category). */
export type EventCategory = {
	name: string;
	color: ThemeColor;
};

export type TemsEvent = {
	id: number;
	title: string;
	description: string;
	/** Fecha ISO 8601 con zona horaria (ej. 2026-05-28T18:00:00-05:00). */
	date: string;
	/** Opcional: un evento puede no tener categoría. */
	category?: EventCategory;
	location: string;
	speaker?: {
		name: string;
		photo?: Media;
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
	photo?: Media;
	social: SocialLinks;
};

/* ---------- Rich text (Strapi "Blocks") ---------- */

export type TextNode = {
	type: "text";
	text: string;
	bold?: boolean;
	italic?: boolean;
	underline?: boolean;
	strikethrough?: boolean;
	code?: boolean;
};

export type LinkNode = { type: "link"; url: string; children: TextNode[] };

export type InlineNode = TextNode | LinkNode;

export type ListItemBlock = { type: "list-item"; children: InlineNode[] };

export type Block =
	| { type: "paragraph"; children: InlineNode[] }
	| {
			type: "heading";
			level: 1 | 2 | 3 | 4 | 5 | 6;
			children: InlineNode[];
	  }
	| {
			type: "list";
			format: "ordered" | "unordered";
			children: (ListItemBlock | Extract<Block, { type: "list" }>)[];
	  }
	| { type: "quote"; children: InlineNode[] }
	| { type: "code"; children: TextNode[] }
	| {
			type: "image";
			image: {
				url: string;
				alternativeText?: string | null;
				width?: number;
				height?: number;
			};
	  };

/* ---------- Proyectos ---------- */

export type ProjectColor = ThemeColor;

export type ProjectStatus = "activo" | "en-pausa" | "finalizado";

export type Feature = { text: string; icon: string };

/** Figuras SVG decorativas de las tarjetas (ver `CardDecoration.astro`). */
export type ProjectDecoration =
	| "mancha"
	| "anillos"
	| "puntos"
	| "barras"
	| "ondas"
	| "hexagonos"
	| "cruces";

export type ProjectMember = TeamMember & {
	/** Rol de la persona dentro del proyecto (si no hay, se usa su rol general). */
	projectRole?: string;
};

export type Project = {
	id: number;
	/** Id del documento en Strapi (lo usa la vista previa). */
	documentId?: string;
	/** Generado a partir del nombre; no se edita en Strapi. */
	slug: string;
	name: string;
	summary: string;
	description: Block[];
	cover?: Media;
	color: ProjectColor;
	status: ProjectStatus;
	/** Icono de Lucide que identifica al proyecto (si falta, el de la primera característica). */
	icon: string;
	/** Figura decorativa elegida en Strapi; si falta, se alterna según la posición. */
	decoration?: ProjectDecoration;
	features: Feature[];
	members: ProjectMember[];
	links: { label: string; url: string }[];
	featured: boolean;
};

/* ---------- Contenido general ---------- */

export type SocialNetwork =
	| "instagram"
	| "linkedin"
	| "youtube"
	| "whatsapp"
	| "email";

export type SiteSettings = {
	description: string;
	contactEmail?: string;
	socialLinks: { network: SocialNetwork; url: string }[];
};

export type About = {
	title: string;
	intro: string;
	mission?: string;
	vision?: string;
};

export type JoinPage = {
	intro: string;
	recruitmentOpen: boolean;
	recruitmentNote?: string;
	whatsappUrl?: string;
	steps: { title: string; description?: string }[];
	contacts: { name: string; role?: string; email?: string; phone?: string }[];
	details: Block[];
};
