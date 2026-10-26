import Link from "next/link";
import {
  ArrowUpRight,
  Braces,
  Check,
  Database,
  FileCode2,
  ListTodo,
  Terminal,
} from "lucide-react";
import type { Project } from "@/data/projects";

function ProjectArtwork({ slug }: { slug: string }) {
  if (slug === "focusboard") {
    return (
      <div
        className="flex h-full flex-col gap-2 rounded-xl border border-[#203c1420] bg-white/85 p-4 text-[#263a28]"
        aria-hidden="true">

        <div className="mb-1 flex items-center justify-between">

          <span className="flex items-center gap-2 text-xs font-semibold">
            <ListTodo size={17} /> Your next good idea
          </span>
          <span className="text-[10px] text-[#63765e]">2 of 3 done</span>

        </div>
        {[
          "Make a little plan",
          "Build something useful",
          "Share it with the world",
        ].map((item, index) => (
          <div
            key={item}
            className="flex items-center gap-3 rounded-lg border border-[#203c1410] bg-white p-3 text-[11px]">

            <span
              className={`flex h-4 w-4 items-center justify-center rounded border ${index < 2 ? "border-[#6a8a44] bg-[#d9eac6]" : "border-[#b6c3a9]"}`}>
              {index < 2 && <Check size={11} />}
            </span>
            <span className={index < 2 ? "text-[#6f7b67] line-through" : ""}>
              {item}
            </span>

          </div>
        ))}
        <div className="mt-1 h-1.5 rounded-full bg-[#e7eddc]">

          <div className="h-full w-2/3 rounded-full bg-[#8caa65]" />

        </div>

      </div>
    );
  }
  if (slug === "django-api-lab") {
    return (
      <div
        className="h-full overflow-hidden rounded-xl border border-white/15 bg-[#282334] p-4 text-[#e5ddec]"
        aria-hidden="true">

        <div className="flex items-center justify-between border-b border-white/10 pb-3">

          <span className="flex items-center gap-2 font-mono text-[11px]">

            <Terminal size={15} />
            <span className="text-[#c8ed99]">GET</span> /api/tasks/

          </span>
          <span className="rounded bg-[#d4f3b319] px-2 py-1 font-mono text-[9px] text-[#c8ed99]">
            200 OK
          </span>

        </div>
        <pre className="mt-3 font-mono text-[11px] leading-[1.6] text-[#cbbddc]">
          {
            '{\n  "count": 3,\n  "results": [\n    { "id": 1, "title": "Build an idea" }\n  ]\n}'
          }
        </pre>

      </div>
    );
  }
  return (
    <div
      className="h-full overflow-hidden rounded-xl border border-[#57361b1c] bg-white/85 p-4 text-[#684933]"
      aria-hidden="true">

      <div className="mb-3 flex items-center justify-between">

        <span className="flex items-center gap-2 text-xs font-semibold">

          <Database size={16} /> A cleaner kind of data

        </span>
        <Check size={16} />

      </div>
      <div className="overflow-hidden rounded-lg border border-[#71523120] text-[10px]">

        <div className="grid grid-cols-3 bg-[#f7eddf] px-3 py-2 font-semibold">

          <span>Name</span>
          <span>Role</span>
          <span>City</span>

        </div>
        {[
          ["Ada", "Developer", "Nairobi"],
          ["Sam", "Designer", "Accra"],
          ["Mina", "Creator", "Lagos"],
        ].map((row) => (
          <div
            key={row[0]}
            className="grid grid-cols-3 border-t border-[#71523112] px-3 py-2">
            {row.map((cell) => (
              <span key={cell}>{cell}</span>
            ))}
          </div>
        ))}
      </div>
      <p className="mb-0 mt-2 text-[9px] text-[#8b7158]">
        Sample data · Clean. Preview. Download.
      </p>

    </div>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  const artBackground =
    project.accent === "green"
      ? "bg-[#e5edda]"
      : project.accent === "violet"
        ? "bg-[#eae3f1]"
        : "bg-[#f5e8d8]";
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-(--line) bg-(--surface) transition-transform duration-200 hover:-translate-y-1">

      <Link
        href={`/projects/${project.slug}/`}
        className={`block h-64 overflow-hidden p-5 ${artBackground}`}
        aria-label={`Explore ${project.title}`}>
        <ProjectArtwork slug={project.slug} />
      </Link>
      <div className="flex flex-1 flex-col p-6">

        <p className="mb-3 flex flex-wrap items-center justify-between gap-3 text-xs font-medium uppercase tracking-[.1em] text-(--muted)">

          <span>{project.category}</span>
          <span className="flex items-center gap-1.5 normal-case tracking-normal">
            <Braces size={12} />
            {project.kind}
          </span>

        </p>
        <h3 className="mb-3 text-[22px] font-semibold tracking-tight">
          <Link href={`/projects/${project.slug}/`}>{project.title}</Link>
        </h3>
        <p className="mb-5 text-sm leading-relaxed text-(--muted)">
          {project.summary}
        </p>
        <ul className="mb-6 mt-auto flex flex-wrap gap-1.5">
          {project.stack.map((item) => (
            <li
              key={item}
              className="rounded border border-(--line) px-2 py-1 text-xs text-(--muted)">
              {item}
            </li>
          ))}
        </ul>
        <div className="space-y-4 border-t border-(--line) pt-4">

          <Link
            href={`/projects/${project.slug}/#project-demo`}
            className="flex items-center justify-between text-sm font-semibold">

            Try the demo
            <ArrowUpRight
              size={18}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"/>

          </Link>
          <Link
            href={`/projects/${project.slug}/#behind-the-build`}
            className="inline-flex min-h-6 items-center gap-2 text-xs font-medium text-(--muted) hover:text-(--green)">
            <FileCode2 size={14} aria-hidden="true" /> Behind the build
          </Link>

        </div>

      </div>
      
    </article>
  );
}
