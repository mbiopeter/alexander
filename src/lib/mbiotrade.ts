/** Public website only: this portfolio never handles Deriv credentials or orders. */
import { publicProjects } from "@/data/public-projects";

export const MBIOTRADE_URL = publicProjects.find((project) => project.slug === "mbiotrade")!.liveUrl;
