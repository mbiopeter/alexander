import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { notes, getNote } from "@/data/notes";
import { NoteCard } from "@/components/note-card";
import { makeMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return notes.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const note = getNote((await params).slug);
  return note ? makeMetadata(note.title, note.summary, `/notes/${note.slug}/`) : { title: "Note not found — Mbiopeter", robots: { index: false } };
}

export default async function NotePage({ params }: Props) {
  const note = getNote((await params).slug);
  if (!note) notFound();
  return (
    <main id="main" className="page-main">

      <article className="shell py-10 md:py-16">

        <Link href="/notes/" className="text-link mb-9"><ArrowLeft size={16} /> All notes &amp; resources</Link>
        <header className="max-w-3xl border-b border-(--line) pb-9">

          <p className="eyebrow">{note.category} <span className="ml-3 normal-case tracking-normal text-(--muted)">{note.readingTime}</span></p>
          <h1 className="my-5 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">{note.title}</h1>
          <p className="mb-0 text-base leading-8 text-(--muted)">{note.summary}</p>
          <p className="mb-0 mt-5 text-sm text-(--muted)">By Mbiopeter</p>

        </header>
        <div className="grid items-start gap-10 pt-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-20">

          <div className="min-w-0 max-w-3xl space-y-10">

            {note.sections.map((section) => (
              <section key={section.title}>

                <h2 className="mb-4 text-2xl font-semibold tracking-tight">{section.title}</h2>
                <p className="text-base leading-8 text-(--muted)">{section.body}</p>
                {section.code && <pre className="my-5 overflow-x-auto rounded-2xl border border-(--line) bg-(--surface-soft) p-5 font-mono text-sm leading-7"><code>{section.code}</code></pre>}
                {section.checklist && <ul className="mt-5 space-y-3">{section.checklist.map((item) => <li key={item} className="flex gap-3 text-sm leading-7"><Check size={17} className="mt-1 shrink-0 text-(--green)" aria-hidden="true" />{item}</li>)}</ul>}

              </section>
            ))}
            <section className="border-t border-(--line) pt-7" aria-label="Further reading">

              <h2 className="mb-4 text-lg font-semibold">Read a little further</h2>
              <ul className="space-y-3">{note.references.map((reference) => <li key={reference.href}><a href={reference.href} target="_blank" rel="noopener noreferrer" className="text-link">{reference.label}<ArrowUpRight size={15} /><span className="sr-only"> (opens in a new tab)</span></a></li>)}</ul>

            </section>
          </div>
          <aside className="info-card lg:sticky lg:top-28">

            <p className="eyebrow">MAKE IT PRACTICAL</p>
            <h2 className="mb-3 mt-4 text-xl font-semibold">Try one small next step.</h2>
            <p className="mb-6 text-sm leading-7 text-(--muted)">Put the idea to work with an example, an exercise or a conversation about your own project.</p>
            <Link href={note.next.href} className="text-link">{note.next.label}<ArrowUpRight size={17} /></Link>

          </aside>

        </div>

      </article>
      <section className="shell pb-20 pt-8" aria-label="More practical notes">

        <h2 className="mb-7 text-2xl font-semibold">Keep the curiosity going.</h2>
        <div className="grid gap-5 md:grid-cols-2">{notes.filter((item) => item.slug !== note.slug).map((item) => <NoteCard key={item.slug} note={item} />)}</div>

      </section>
      
    </main>
  );
}
