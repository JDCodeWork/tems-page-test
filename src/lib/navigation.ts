export type NavLink = {
	label: string;
	href: string;
	/** `id` de la sección de la página de inicio (para el scroll-spy). */
	section: string;
	/** Ruta de una página propia que también marca el enlace como activo. */
	path?: string;
};

export const navLinks: NavLink[] = [
	{ label: "Inicio", href: "/#inicio", section: "inicio" },
	{ label: "Nosotros", href: "/#nosotros", section: "nosotros" },
	{
		label: "Proyectos",
		href: "/#proyectos",
		section: "proyectos",
		path: "/proyectos",
	},
	{ label: "Eventos", href: "/#eventos", section: "eventos", path: "/eventos" },
	{ label: "Equipo", href: "/#equipo", section: "equipo" },
];

/** Enlace activo según la ruta actual (fuera de la página de inicio). */
export function activeSection(pathname: string): string | undefined {
	const path = pathname.replace(/\/+$/, "") || "/";
	if (path === "/") return "inicio";
	return navLinks.find((link) => link.path && path.startsWith(link.path))
		?.section;
}
