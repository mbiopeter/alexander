import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Globe2, Layers3, Sparkles } from "lucide-react";
import { publicProjects } from "@/data/public-projects";
import { makeMetadata } from "@/lib/metadata";

const baseMetadata = makeMetadata(
  "Public Projects — Live apps and products",
  "A directory for independently deployed Mbiopeter software, with practical interactive projects available in the portfolio.",
  "/public-projects/",
);

export const metadata: Metadata = publicProjects.length
  ? baseMetadata
  : { ...baseMetadata, robots: { index: false, follow: true } };

export default function PublicProjectsPage() {
  return (
    <main id="main" className="page-main public-projects-page">
      <section className="shell public-projects-hero">
        <div className="public-projects-intro">
          <p className="eyebrow"><Globe2 size={15} aria-hidden="true" /> LIVE SOFTWARE / PUBLIC PROJECTS</p>
          <h1>Projects that live <span>beyond the portfolio.</span></h1>
          <p>A home for independently released tools and applications. In the meantime, you can explore the interactive demos already available on this website.</p>
          <Link href="/projects/" className="button button-primary">Try the interactive projects <ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
        <div className="public-projects-hero-art" aria-hidden="true"><span className="public-projects-art-orbit"/><Layers3 size={92} strokeWidth={.75}/><span className="public-projects-art-caption">DESIGNED · BUILT · SHIPPED</span></div>
      </section>
      <section id="public-projects-list" className="shell page-section public-projects-list" aria-labelledby="public-projects-list-title">
        <div className="public-projects-list-heading"><div><p className="eyebrow">EXPLORE THE COLLECTION</p><h2 id="public-projects-list-title">Available to explore.</h2></div><span>{String(publicProjects.length).padStart(2, "0")} LIVE PROJECT{publicProjects.length === 1 ? "" : "S"}</span></div>
        {publicProjects.length === 0 && (
          <div className="public-projects-more" role="status">
            <span className="public-projects-more-icon"><Sparkles size={21} aria-hidden="true" /></span>
            <div>
              <h3>No standalone releases listed right now.</h3>
              <p>Explore the task planner, API simulation and CSV utility in the <Link href="/projects/">project gallery</Link>.</p>
            </div>
          </div>
        )}
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
              <div className="public-project-generic-visual" aria-hidden="true"><Globe2 size={58} strokeWidth={1} /><span>{project.name}</span><small>PUBLIC BUILD</small></div>
            </div>
          </article>
        ))}
        {publicProjects.length > 0 && (
          <div className="public-projects-more"><span className="public-projects-more-icon"><Sparkles size={21} aria-hidden="true" /></span><div><h3>More is in the works.</h3><p>This collection grows as independently hosted projects are ready to share.</p></div></div>
        )}
      </section>
    </main>
  );
}
