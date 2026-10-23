"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { projects } from "@/data/projects";
import { ProjectCard } from "./project-card";

const categories = [
  "All projects",
  ...new Set(projects.map((project) => project.category)),
];

export function ProjectsExplorer() {
  const [category, setCategory] = useState("All projects");
  const [query, setQuery] = useState("");
  const shown = useMemo(
    () =>
      projects.filter((project) => {
        const matchesCategory =
          category === "All projects" || project.category === category;
        const text =
          `${project.title} ${project.category} ${project.summary} ${project.stack.join(" ")}`.toLowerCase();
        return matchesCategory && text.includes(query.trim().toLowerCase());
      }),
    [category, query],
  );

  return (
    <>
      <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter projects by category"
        >
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
              className={`min-h-11 rounded-full border px-4 py-2 text-xs font-medium transition-colors ${category === item ? "border-[var(--text)] bg-[var(--text)] text-[var(--bg)]" : "border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--text)]"}`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="relative w-full lg:max-w-72">
          <label className="sr-only" htmlFor="project-search">
            Search projects
          </label>
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]"
          />
          <input
            id="project-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Find a project or technology"
            maxLength={100}
            className="min-h-11 w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] py-3 pl-10 pr-4 text-sm text-[var(--text)] placeholder:text-[var(--muted)]"
          />
        </div>
      </div>
      <p className="mb-5 text-xs text-[var(--muted)]" role="status">
        {shown.length} {shown.length === 1 ? "project" : "projects"}
        {query.trim() ? ` matching “${query.trim()}”` : " to explore"}
      </p>
      {shown.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {shown.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface)] p-12 text-center">
          <Search className="mx-auto mb-4 text-[var(--muted)]" size={28} />
          <h2 className="!text-xl !tracking-tight">No matches just yet.</h2>
          <p className="mb-5 text-sm text-[var(--muted)]">
            Try another search or explore all the demos.
          </p>
          <button
            type="button"
            className="button button-outline"
            onClick={() => {
              setQuery("");
              setCategory("All projects");
            }}
          >
            <X size={15} />
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
