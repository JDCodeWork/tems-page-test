import type { TeamMember } from "@/types";
import { teamMembers as fallbackTeam } from "./content";
import { fetchCollection, mediaUrl, type StrapiMedia } from "./strapi";

type StrapiTeamMember = {
	id: number;
	name: string;
	role: string;
	photo?: StrapiMedia;
	linkedin?: string | null;
	email?: string | null;
};

export async function fetchTeamMembers(): Promise<TeamMember[]> {
	const data = await fetchCollection<StrapiTeamMember>("team-members", {
		sort: "order:asc",
		populate: "photo",
		"pagination[pageSize]": "50",
	});

	if (data === null) return fallbackTeam;

	return data.map((member) => ({
		id: member.id,
		name: member.name,
		role: member.role,
		photo: mediaUrl(member.photo),
		social: {
			linkedin: member.linkedin ?? undefined,
			email: member.email ? `mailto:${member.email}` : undefined,
		},
	}));
}
