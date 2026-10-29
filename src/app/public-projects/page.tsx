import Link from "next/link";
import { ArrowRight, ArrowUpRight, Globe2, Layers3, Sparkles } from "lucide-react";
import { MbiotradePreview } from "@/components/mbiotrade-preview";
import { publicProjects } from "@/data/public-projects";
import { makeMetadata } from "@/lib/metadata";

export const metadata = makeMetadata(
  "Public Projects — Live apps and products",
  "Explore independently deployed apps and tools built by Mbiopeter, starting with the mbioTraders market-signal dashboard.",
  "/public-projects/",
);

export default function PublicProjectsPage() {
  return (
    <main id="main" className="page-main public-projects-page">
      <section className="shell public-projects-hero">
        <div className="public-projects-intro">
          <p className="eyebrow"><Globe2 size={15} aria-hidden="true" /> LIVE SOFTWARE / PUBLIC PROJECTS</p>
          <h1>Projects that live <span>beyond the portfolio.</span></h1>
          <p>Independent products I build, improve and put online. Explore the story behind each project, then open the real application.</p>
          <a href="#public-projects-list" className="button button-primary">Explore the projects <ArrowRight size={18} aria-hidden="true" /></a>
        </div>
        <div className="public-projects-hero-art" aria-hidden="true"><span className="public-projects-art-orbit"/><Layers3 size={92} strokeWidth={.75}/><span className="public-projects-art-caption">DESIGNED · BUILT · SHIPPED</span></div>
      </section>
      <section id="public-projects-list" className="shell page-section public-projects-list" aria-labelledby="public-projects-list-title">
        <div className="public-projects-list-heading"><div><p className="eyebrow">EXPLORE THE COLLECTION</p><h2 id="public-projects-list-title">Available to explore.</h2></div><span>{String(publicProjects.length).padStart(2, "0")} LIVE PROJECT{publicProjects.length === 1 ? "" : "S"}</span></div>
        {publicProjects.map((project) => (
          <article className="public-project-card" key={project.slug}>
            <div className="public-project-card-copy">
              <div className="public-project-card-meta"><span><span className="public-project-live-dot"/>{project.status} project</span><span>{project.category}</span></div>
              <h3>{project.name}</h3><p>{project.description}</p>
              <div className="public-project-card-actions">
                <Link className="button button-primary" href={project.href}>Explore the project <ArrowRight size={18} aria-hidden="true" /></Link>
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-link">Launch the app <ArrowUpRight size={17} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
              </div>
            </div>
            <div className="public-project-card-preview">
              {project.slug === "mbiotrade" ? <MbiotradePreview compact /> : (
                <div className="public-project-generic-visual" aria-hidden="true"><Globe2 size={58} strokeWidth={1} /><span>{project.name}</span><small>PUBLIC BUILD</small></div>
              )}
            </div>
          </article>
        ))}
        <div className="public-projects-more"><span className="public-projects-more-icon"><Sparkles size={21} aria-hidden="true" /></span><div><h3>More is in the works.</h3><p>This collection grows as projects are ready to share. The Public Projects menu will update from the same project list.</p></div></div>
      </section>
    </main>
  );
}
