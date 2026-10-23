import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check, Code2 } from "lucide-react";
import { projects } from "@/data/projects";
import { PageIntro, ActionBanner } from "@/components/page-ui";
import { ProjectCard } from "@/components/projects/project-card";
import { Focusboard } from "@/components/projects/focusboard";
import { DjangoApiLab } from "@/components/projects/django-api-lab";
import { DataTidy } from "@/components/projects/data-tidy";
import { makeMetadata } from "@/lib/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  return project
    ? makeMetadata(project.title, project.summary, `/projects/${project.slug}/`)
    : makeMetadata(
        "Project not found",
        "This project could not be found.",
        "/projects/",
      );
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  const otherProjects = projects.filter((item) => item.slug !== slug);

  return (
    <main id="main" className="page-main">
      <PageIntro
        eyebrow={`${project.category.toUpperCase()} / ${project.kind.toUpperCase()}`}
        title={project.title}
        description={project.description}
      >
        <div className="mt-6 flex flex-wrap gap-2">
          {project.stack.map((item) => (
            <span
              key={item}
              className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1.5 text-xs text-[var(--muted)]"
            >
              {item}
            </span>
          ))}
        </div>
      </PageIntro>
      <section
        className="page-section shell !pt-0"
        aria-label={`${project.title} demonstration`}
      >
        <Link
          href="/projects/"
          className="mb-8 inline-flex items-center gap-2 text-xs font-medium text-[var(--muted)] hover:text-[var(--text)]"
        >
          <ArrowLeft size={15} />
          All projects
        </Link>
        <div className="mb-8 grid gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface-soft)] p-5 md:grid-cols-3">
          {project.features.map((feature) => (
            <p
              key={feature}
              className="mb-0 flex items-start gap-2 text-xs leading-relaxed text-[var(--muted)]"
            >
              <Check
                size={15}
                className="mt-0.5 shrink-0 text-[var(--green)]"
              />
              {feature}
            </p>
          ))}
        </div>
        {slug === "focusboard" ? (
          <Focusboard />
        ) : slug === "django-api-lab" ? (
          <DjangoApiLab />
        ) : (
          <DataTidy />
        )}
        <p className="mb-0 mt-5 flex items-start gap-2 text-xs leading-relaxed text-[var(--muted)]">
          <Code2 size={15} className="mt-0.5 shrink-0" />
          This is a frontend demonstration. There are no accounts, backend APIs,
          or shared databases.
        </p>
      </section>
      <section
        className="page-section shell"
        aria-labelledby="more-projects-title"
      >
        <div className="mb-7 flex items-end justify-between gap-5">
          <h2
            id="more-projects-title"
            className="!mb-0 !text-3xl !tracking-tight"
          >
            Keep exploring.
          </h2>
          <Link
            href="/projects/"
            className="inline-flex items-center gap-2 text-xs font-semibold"
          >
            All projects
            <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {otherProjects.map((item) => (
            <ProjectCard key={item.slug} project={item} />
          ))}
        </div>
      </section>
      <ActionBanner
        title="Need something built around you?"
        description="Share the problem. We can work out the right tool together."
      />
    </main>
  );
}
