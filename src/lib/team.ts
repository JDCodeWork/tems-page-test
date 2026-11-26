import type { TeamMember } from "@/types";
import { exampleTeam } from "./content";
import { fetchCollection, type StrapiMedia, toMedia } from "./strapi";

export type StrapiTeamMember = {
	id: number;
	name: string;
	role: string;
	photo?: StrapiMedia;
	linkedin?: string | null;
	email?: string | null;
	showInTeam?: boolean | null;
};

export function mapTeamMember(member: StrapiTeamMember): TeamMember {
	return {
		id: member.id,
		name: member.name,
		role: member.role,
		photo: toMedia(member.photo, member.name),
		social: {
			linkedin: member.linkedin || undefined,
			email: member.email ? `mailto:${member.email}` : undefined,
		},
	};
}

/** Personas que se muestran en "Nuestro equipo". */
export async function fetchTeamMembers(): Promise<TeamMember[]> {
	const data = await fetchCollection<StrapiTeamMember>("team-members", {
		"sort[0]": "order:asc",
		"sort[1]": "name:asc",
		populate: "photo",
		"pagination[pageSize]": "100",
	});

	if (data === null) return exampleTeam;

	// `showInTeam` vacío (registros anteriores al campo) cuenta como visible.
	return data
		.filter((member) => member.showInTeam !== false)
		.map(mapTeamMember);
}
