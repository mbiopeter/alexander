import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";
import type { Note } from "@/data/notes";

export function NoteCard({ note }: { note: Note }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-(--line) bg-(--surface) p-6 sm:p-7">

      <div className="mb-6 flex items-center justify-between gap-4 text-[11px] font-medium text-(--muted)">

        <span className="tracking-wider">{note.category}</span>
        <BookOpen size={18} className="text-(--green)" aria-hidden="true" />

      </div>
      <h3 className="mb-3 text-xl font-semibold tracking-tight">
        <Link href={`/notes/${note.slug}/`}>{note.title}</Link>
      </h3>
      <p className="mb-7 text-sm leading-7 text-(--muted)">{note.summary}</p>
      <Link href={`/notes/${note.slug}/`} className="mt-auto flex min-h-11 items-center justify-between gap-3 border-t border-(--line) pt-4 text-sm font-semibold">
        Read the note <span className="ml-auto text-xs font-normal text-(--muted)">{note.readingTime}</span><ArrowUpRight size={17} aria-hidden="true" />
      </Link>
      
    </article>
  );
}
