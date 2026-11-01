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

export const publicProjects: PublicProject[] = [
  {
    slug: "mbiotrade",
    name: "mbioTraders",
    category: "Market intelligence",
    description: "An installable signal dashboard for Gold, five forex pairs and BTC/USD with 5-minute entry confirmation, real browser notifications, economic-news safeguards and signal history.",
    href: "/mbiotrade/",
    liveUrl: "https://traders.mbiopeter.co.ke/",
    status: "Live",
  },
];
