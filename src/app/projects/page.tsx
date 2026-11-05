import { PageIntro, ActionBanner } from "@/components/page-ui";
import { ProjectsExplorer } from "@/components/projects/projects-explorer";
import { makeMetadata } from "@/lib/metadata";

export const metadata = makeMetadata(
  "Projects",
  "Explore Mbiopeter’s interactive task board, API simulation and CSV cleanup tool with build notes and downloadable source.",
  "/projects/",
);

export default function ProjectsPage() {
  return (
    <main id="main" className="page-main">

      <PageIntro
        eyebrow="THE WORKBENCH"
        title="Ideas you can actually try."
        description="Explore practical interactive tools, try the demos and read the decisions behind each build."/>
      <section className="page-section shell" aria-label="Browse projects">

        <div className="mb-8 flex gap-3 rounded-xl border border-(--line) bg-(--surface-soft) p-4 text-sm leading-relaxed text-(--muted)">

          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-(--green)" />
          <p className="mb-0">
            These three interactive projects are original portfolio demos, not client case studies.
            They run in your browser; the API lab is a clearly labelled simulation.
          </p>

        </div>
        <ProjectsExplorer />

      </section>
      <ActionBanner
        title="Got a useful idea of your own?"
        description="Let’s turn it into a website, a tool, or something that makes your day easier."/>
        
    </main>
  );
}
