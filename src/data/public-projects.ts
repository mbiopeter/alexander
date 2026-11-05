/**
 * Single source of truth for separately deployed, public-facing products.
 * Add a project here to show it in the desktop/mobile Public Projects menu
 * and on /public-projects/. Keep /projects/ for interactive portfolio demos.
 */
export type PublicProject = {
  slug: string;
  name: string;
  category: string;
  description: string;
  href: string;
  liveUrl: string;
  status: "Live" | "Preview";
};

export const publicProjects: PublicProject[] = [];
