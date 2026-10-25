import { PageIntro, ActionBanner } from "@/components/page-ui";
import { ProjectsExplorer } from "@/components/projects/projects-explorer";
import { makeMetadata } from "@/lib/metadata";

export const metadata = makeMetadata(
  "Projects",
  "Explore Mbiopeter’s interactive frontend projects: a task board, an API learning lab, and a CSV cleanup tool.",
  "/projects/",
);

export default function ProjectsPage() {
  return (
    <main id="main" className="page-main">
      <PageIntro
        eyebrow="THE WORKBENCH"
        title="Ideas you can actually try."
        description="A few small projects with a practical purpose. Explore the details, try the tools, and see how thoughtful code makes everyday things easier."
      />
      <section className="page-section shell" aria-label="Browse project demos">
        <div className="mb-8 flex gap-3 rounded-xl border border-[var(--line)] bg-[var(--surface-soft)] p-4 text-sm leading-relaxed text-[var(--muted)]">
          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--green)]" />
          <p className="mb-0">
            These are original demonstration projects, not client case studies.
            The tools run in your browser; the API lab is a labelled simulation.
          </p>
        </div>
        <ProjectsExplorer />
      </section>
      <ActionBanner
        title="Got a useful idea of your own?"
        description="Let’s turn it into a website, a tool, or something that makes your day easier."
      />
    </main>
  );
}
