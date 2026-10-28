import { PageIntro, ActionBanner } from "@/components/page-ui";
import { ProjectsExplorer } from "@/components/projects/projects-explorer";
import { MbiotradeFeature } from "@/components/mbiotrade-feature";
import { makeMetadata } from "@/lib/metadata";

export const metadata = makeMetadata(
  "Projects",
  "Explore MbioTrade, a Deriv-connected trading application, alongside Mbiopeter’s interactive task board, API lab and CSV cleanup tool.",
  "/projects/",
);

export default function ProjectsPage() {
  return (
    <main id="main" className="page-main">

      <PageIntro
        eyebrow="THE WORKBENCH"
        title="Ideas you can actually try."
        description="See a working trading platform alongside practical interactive tools. Explore the builds, try the demos, and learn how thoughtful code makes things easier."/>
      <section className="page-section shell" aria-label="Browse projects">
        <MbiotradeFeature placement="projects" />

        <div className="mb-8 flex gap-3 rounded-xl border border-(--line) bg-(--surface-soft) p-4 text-sm leading-relaxed text-(--muted)">

          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-(--green)" />
          <p className="mb-0">
            MbioTrade is a separate deployed application. The three interactive tools below
            are original demos, not client case studies. They run in your browser;
            the API lab is a labelled simulation.
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
