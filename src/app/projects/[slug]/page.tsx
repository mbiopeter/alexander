import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check, Code2, Download, FileCode2, Play } from "lucide-react";
import { projects } from "@/data/projects";
import { getCaseStudy } from "@/data/case-studies";
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
  const study = getCaseStudy(slug);
  const otherProjects = projects.filter((item) => item.slug !== slug);

  return (
    <main id="main" className="page-main">
      <PageIntro
        eyebrow={`${project.category.toUpperCase()} / ${project.kind.toUpperCase()}`}
        title={project.title}
        description={project.description}
      >
        <a href="#project-demo" className="button button-primary">
          <Play size={16} aria-hidden="true" /> Try the demo
        </a>
        <a href="#behind-the-build" className="button button-outline">
          <FileCode2 size={17} aria-hidden="true" /> Behind the build
        </a>
        <div className="flex basis-full flex-wrap gap-2 pt-3">
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
        id="project-demo"
        className="page-section shell scroll-mt-28 !pt-0"
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
      {study && (
        <section
          id="behind-the-build"
          className="tinted-section scroll-mt-24"
          aria-labelledby="build-title"
        >
          <div className="shell page-section">
            <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div className="max-w-2xl">
                <p className="eyebrow">BEHIND THE BUILD / {project.title.toUpperCase()}</p>
                <h2 id="build-title" className="mt-4 !mb-4">
                  {study.heading}
                </h2>
                <p className="mb-0 text-sm leading-7 text-[var(--muted)]">
                  {project.buildNote}
                </p>
              </div>
              <a
                href={project.sourceDownload}
                download
                className="button button-outline w-fit shrink-0"
              >
                <Download size={17} aria-hidden="true" />
                Download demo source
              </a>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <article className="info-card">
                <p className="eyebrow mb-4">THE IDEA</p>
                <h3 className="mb-4 text-xl font-semibold tracking-tight">Start with a useful interaction.</h3>
                <p className="mb-5 text-sm leading-7 text-[var(--muted)]">{study.goal}</p>
                <p className="mb-0 text-sm leading-7 text-[var(--muted)]">{study.approach}</p>
                <p className="mb-0 mt-6 border-t border-[var(--line)] pt-5 text-xs font-medium leading-6 text-[var(--green)]">
                  {study.scope}
                </p>
              </article>
              <article className="info-card">
                <p className="eyebrow mb-4">TRY IT FOR YOURSELF</p>
                <h3 className="mb-6 text-xl font-semibold tracking-tight">Three small things to explore.</h3>
                <ol className="space-y-6">
                  {study.walkthrough.map((step, index) => (
                    <li key={step.action} className="flex gap-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--surface-soft)] text-xs font-semibold text-[var(--green)]" aria-hidden="true">
                        0{index + 1}
                      </span>
                      <div>
                        <h4 className="mb-2 text-sm font-semibold">{step.action}</h4>
                        <p className="mb-0 text-sm leading-6 text-[var(--muted)]">{step.result}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <a href="#project-demo" className="text-link mt-6">
                  Try these steps in the demo <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              </article>
            </div>

            <div className="mb-6 mt-12">
              <p className="eyebrow mb-3">THE CHOICES THAT MATTER</p>
              <h3 className="text-2xl font-semibold tracking-tight">A little reasoning behind the interface.</h3>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {study.decisions.map((decision, index) => (
                <article key={decision.title} className="info-card">
                  <span className="mb-5 inline-block text-xs font-semibold text-[var(--green)]">0{index + 1}</span>
                  <h4 className="mb-4 text-lg font-semibold tracking-tight">{decision.title}</h4>
                  <p className="mb-0 text-sm leading-7 text-[var(--muted)]">{decision.detail}</p>
                </article>
              ))}
            </div>

            <div className="mt-7 grid gap-6 lg:grid-cols-2">
              <article className="info-card">
                <h3 className="mb-5 flex items-center gap-2 text-lg font-semibold">
                  <Check size={20} className="text-[var(--green)]" aria-hidden="true" />
                  The edges deserve attention, too.
                </h3>
                <ul className="space-y-4">
                  {study.edgeCases.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-6 text-[var(--muted)]">
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--green)]" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
              <article className="info-card">
                <h3 className="mb-5 text-lg font-semibold">What this version covers.</h3>
                {study.limitations.map((item) => (
                  <p key={item} className="mb-4 text-sm leading-7 text-[var(--muted)]">{item}</p>
                ))}
                <div className="mt-6 border-t border-[var(--line)] pt-5">
                  <h4 className="mb-2 text-sm font-semibold">A sensible next step</h4>
                  <p className="mb-0 text-sm leading-7 text-[var(--muted)]">{study.nextStep}</p>
                </div>
              </article>
            </div>

            <div className="mt-7 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8">
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
                <div className="min-w-0 max-w-2xl">
                  <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                    <FileCode2 size={20} className="text-[var(--green)]" aria-hidden="true" />
                    Open the source. Follow the decisions.
                  </h3>
                  <p className="mb-5 text-sm leading-7 text-[var(--muted)]">
                    The download contains the demo’s actual source files and a short guide.
                    It is a source extract for reading and reuse within a React project, rather than a separate installed app.
                  </p>
                  <ul className="space-y-2" aria-label="Included source files">
                    {study.sourceFiles.map((file) => (
                      <li key={file} className="break-all font-mono text-xs leading-6 text-[var(--muted)]">{file}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex shrink-0 flex-col items-start gap-4">
                  <a href={project.sourceDownload} download className="button button-primary">
                    <Download size={16} aria-hidden="true" /> Download source ZIP
                  </a>
                  <Link href={`/services/${study.serviceSlug}/`} className="text-link">
                    {study.serviceLabel} <ArrowUpRight size={15} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
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
