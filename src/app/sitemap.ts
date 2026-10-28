import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/links";
import { services } from "@/data/services";
import { projects } from "@/data/projects";
import { publicProjects } from "@/data/public-projects";
import { notes } from "@/data/notes";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getSiteUrl();
  if (!origin) return [];
  const routes = [
    "/",
    "/services/",
    ...services.map((service) => `/services/${service.slug}/`),
    "/projects/",
    "/public-projects/",
    ...publicProjects.map((project) => project.href),
    ...projects.map((project) => `/projects/${project.slug}/`),
    "/learn/",
    "/notes/",
    ...notes.map((note) => `/notes/${note.slug}/`),
    "/playground/",
    "/about/",
    "/hire/",
    "/support/",
    "/privacy/",
  ];
  return routes.map((path) => ({
    url: new URL(path, origin).toString(),
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : path === "/privacy/" ? 0.3 : 0.8,
  }));
}
