import Link from "next/link";
import { ArrowUpRight, Download, Terminal } from "lucide-react";
import { PageIntro } from "@/components/page-ui";
import { NoteCard } from "@/components/note-card";
import { notes } from "@/data/notes";
import { makeMetadata } from "@/lib/metadata";

export const metadata = makeMetadata("Notes & resources", "Short notes on debugging, useful data tools and learning to code, with practical examples and a project brief checklist.", "/notes/");

export default function NotesPage() {
  return (
    <main id="main" className="page-main">
      <PageIntro eyebrow="NOTES & RESOURCES" title="Small ideas worth keeping." description="A few useful explanations from the workbench. Read something, try it, and take the next step at your own pace.">
        <Link href="/learn/" className="button button-primary">Explore the mini lessons <ArrowUpRight size={18} /></Link>
        <Link href="/playground/" className="button button-outline"><Terminal size={17} /> Open the playground</Link>
      </PageIntro>
      <section className="shell pb-16 md:pb-24" aria-label="Practical coding notes">
        <div className="grid gap-5 md:grid-cols-3">{notes.map((note) => <NoteCard key={note.slug} note={note} />)}</div>
      </section>
      <section className="shell pb-20 md:pb-28" aria-labelledby="brief-resource-title">
        <div className="info-card flex flex-col justify-between gap-7 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <p className="eyebrow">A USEFUL STARTING POINT</p>
            <h2 id="brief-resource-title" className="mb-3 mt-3 text-2xl font-semibold">A clearer project starts with a few good questions.</h2>
            <p className="mb-0 text-sm leading-7 text-[var(--muted)]">Use this short checklist to describe the goal, the starting point and what matters most. It is a plain text file you can fill in with any editor.</p>
          </div>
          <a href="/resources/project-brief.txt" download className="button button-outline shrink-0"><Download size={17} /> Download the checklist</a>
        </div>
      </section>
    </main>
  );
}
