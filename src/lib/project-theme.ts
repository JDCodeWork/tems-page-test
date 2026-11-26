import type { ProjectColor, ProjectStatus } from "@/types";

export const projectThemes = {
	orange: {
		accent: "bg-primary",
		soft: "bg-primary/10",
		text: "text-primary",
		button: "bg-primary hover:bg-primary-dark focus-visible:ring-primary",
	},
	blue: {
		accent: "bg-secondary-dark",
		soft: "bg-secondary/10",
		text: "text-secondary-dark",
		button:
			"bg-secondary-dark hover:bg-secondary focus-visible:ring-secondary-dark",
	},
	violet: {
		accent: "bg-violet-700",
		soft: "bg-violet-700/10",
		text: "text-violet-700",
		button: "bg-violet-700 hover:bg-violet-800 focus-visible:ring-violet-700",
	},
	green: {
		accent: "bg-emerald-700",
		soft: "bg-emerald-700/10",
		text: "text-emerald-700",
		button:
			"bg-emerald-700 hover:bg-emerald-800 focus-visible:ring-emerald-700",
	},
} satisfies Record<
	ProjectColor,
	Record<"accent" | "soft" | "text" | "button", string>
>;

export function projectTheme(color: ProjectColor) {
	return projectThemes[color] ?? projectThemes.orange;
}

export const projectStatuses = {
	activo: { label: "Activo", class: "bg-emerald-100 text-emerald-800" },
	"en-pausa": { label: "En pausa", class: "bg-amber-100 text-amber-800" },
	finalizado: { label: "Finalizado", class: "bg-slate-200 text-slate-700" },
} satisfies Record<ProjectStatus, { label: string; class: string }>;
