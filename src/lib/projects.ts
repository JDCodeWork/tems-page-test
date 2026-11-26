import type {
	Block,
	Feature,
	Project,
	ProjectColor,
	ProjectMember,
	ProjectStatus,
} from "@/types";
import { exampleProjects } from "./content";
import { fetchCollection, type StrapiMedia, toMedia } from "./strapi";
import { mapTeamMember, type StrapiTeamMember } from "./team";
import { uniqueSlugs } from "./utils";

type StrapiProject = {
	id: number;
	name: string;
	summary: string;
	description?: Block[] | null;
	cover?: StrapiMedia;
	color?: ProjectColor | null;
	status?: ProjectStatus | null;
	features?: Feature[];
	members?: { role?: string | null; person?: StrapiTeamMember | null }[];
	links?: { label: string; url: string }[];
	featured?: boolean | null;
};

/**
 * Todos los proyectos publicados, en el orden definido en Strapi.
 * El `slug` (URL de la página) se calcula a partir del nombre.
 */
export async function fetchProjects(): Promise<Project[]> {
	const data = await fetchCollection<StrapiProject>("projects", {
		"sort[0]": "order:asc",
		"sort[1]": "name:asc",
		"populate[cover]": "true",
		"populate[features]": "true",
		"populate[links]": "true",
		"populate[members][populate][person][populate]": "photo",
		"pagination[pageSize]": "100",
	});

	if (data === null) return exampleProjects;

	const slugs = uniqueSlugs(data.map((project) => project.name));

	return data.map((project, i) => ({
		id: project.id,
		slug: slugs[i],
		name: project.name,
		summary: project.summary,
		description: project.description ?? [],
		cover: toMedia(project.cover, project.name),
		color: project.color ?? "orange",
		status: project.status ?? "activo",
		features: project.features ?? [],
		// Una relación a una persona sin publicar llega como `null`.
		members: (project.members ?? []).flatMap(
			({ role, person }): ProjectMember[] =>
				person
					? [{ ...mapTeamMember(person), projectRole: role || undefined }]
					: [],
		),
		links: project.links ?? [],
		featured: project.featured !== false,
	}));
}
