import Link from "next/link";
import {
  ArrowUpRight,
  Braces,
  Check,
  Database,
  Play,
  Terminal,
} from "lucide-react";
import { DestinationLink } from "@/components/destination-link";
import { LearningPlayground } from "@/components/learning-playground";
import { ActionBanner, PageIntro, SectionHeading } from "@/components/page-ui";
import { makeMetadata } from "@/lib/metadata";
import { NoteCard } from "@/components/note-card";
import { notes } from "@/data/notes";

export const metadata = makeMetadata(
  "Learn with Mbiopeter",
  "Explore short, practical coding lessons from Mbiopeter. Try React, debugging, and Tailwind demos, and learn from Python and Django examples.",
  "/learn/",
);

const practiceIdeas = [
  {
    icon: Terminal,
    eyebrow: "PYTHON",
    title: "Make messy input useful.",
    description:
      "Start with the cleaning example in the playground. Add a few values of your own and decide which should stay in the result.",
    steps: [
      "Try spaces, empty strings, and missing values.",
      "Keep the input unchanged; return a cleaned list.",
      "Check the result against the output you expected.",
    ],
    href: "/playground/?language=python&challenge=count-vowels",
    action: "Practise Python strings",
  },
  {
    icon: Database,
    eyebrow: "DJANGO",
    title: "Connect a URL to a view.",
    description:
      "Use the JSON-response example inside a small Django project. Trace the route from the URL pattern to the view and back to the response.",
    steps: [
      "Create a view that returns a small JSON object.",
      "Include the app’s URLs in your project.",
      "Visit the endpoint and inspect the response.",
    ],
    href: "/projects/django-api-lab/",
    action: "Explore the API simulation",
  },
  {
    icon: Braces,
    eyebrow: "REACT",
    title: "Finish a tiny interaction.",
    description:
      "Take the counter component and make it a little more useful. Keep each change small enough that you can explain what it does.",
    steps: [
      "Add a reset button that sets the count to zero.",
      "Try a second button that decreases the count.",
      "Decide whether negative values make sense.",
    ],
    href: "/projects/focusboard/",
    action: "Explore state in Focusboard",
  },
];

export default function LearnPage() {
  return (
    <main id="main" className="page-main">

      <PageIntro
        eyebrow="LEARN WITH ALEXENDER"
        title="Small lessons. Practical progress."
        description="I make short coding tutorials for the moments when you want a clear explanation and something useful to try. Explore a few ideas here, then keep learning with me on TikTok.">

        <DestinationLink destination="tiktok" className="button button-primary">
          <Play size={17} aria-hidden="true" />
          Watch on TikTok
          <ArrowUpRight size={18} aria-hidden="true" />
        </DestinationLink>
        <a href="#playground" className="button button-quiet">
          Try a mini lesson
          <ArrowUpRight size={18} aria-hidden="true" />
        </a>
        <Link href="/playground/" className="button button-outline">
          <Terminal size={17} aria-hidden="true" />
          Open coding playground
          <ArrowUpRight size={18} aria-hidden="true" />
        </Link>

      </PageIntro>
      <LearningPlayground />
      <section
        className="shell py-16 md:py-24"
        aria-label="Coding practice ideas">

        <SectionHeading
          eyebrow="MAKE IT STICK"
          title="A small change is a good next step."
          description="Understanding the example is the start. Changing it and checking what happens is where the idea becomes your own."/>
        <div className="mt-9 grid gap-5 lg:grid-cols-3">
          {practiceIdeas.map(
            ({ icon: Icon, eyebrow, title, description, steps, href, action }) => (
              <article
                key={eyebrow}
                className="flex flex-col rounded-2xl border border-(--line) bg-(--surface) p-7">

                <div className="mb-6 flex items-center justify-between">

                  <Icon
                    size={26}
                    className="text-(--green)"
                    aria-hidden="true"/>
                  <span className="text-[10px] font-semibold tracking-widest text-(--muted)">
                    {eyebrow}
                  </span>

                </div>
                <h3 className="mb-3 text-xl font-semibold">{title}</h3>
                <p className="mb-6 text-sm leading-7 text-(--muted)">
                  {description}
                </p>
                <ul className="mt-auto space-y-3 border-t border-(--line) pt-5">
                  {steps.map((step) => (
                    <li
                      key={step}
                      className="flex gap-2 text-sm leading-6 text-(--muted)">

                      <Check
                        size={14}
                        className="mt-1 shrink-0 text-(--green)"
                        aria-hidden="true"/>
                      {step}

                    </li>
                  ))}
                </ul>
                <Link href={href} className="text-link mt-6 min-h-11">{action}<ArrowUpRight size={17} /></Link>

              </article>
            ),
          )}
        </div>

      </section>
      <section
        className="border-y border-(--line) bg-(--surface-soft) py-16 md:py-20"
        aria-labelledby="learning-approach-title">

        <div className="shell grid gap-8 md:grid-cols-2 md:items-center md:gap-16">

          <div>

            <p className="eyebrow">ONE IDEA AT A TIME</p>
            <h2 id="learning-approach-title">
              Keep the example small.
              <br />
              <span className="muted-heading">Keep your curiosity.</span>
            </h2>

          </div>
          <div className="space-y-5 text-sm leading-7 text-(--muted)">

            <p>
              Read the code, predict the result, and then try it. When something
              surprises you, change one thing at a time until you can explain
              why.
            </p>
            <p>
              The frontend examples are interactive on this page. Python and
              Django include illustrated output and notes for running the code
              in your own environment.
            </p>
            <p className="mb-0">

              Have an idea for a tutorial?{" "}
              <DestinationLink
                destination="whatsapp"
                message="Hi Mbiopeter! Could you make a short tutorial about: "
                className="inline-flex items-center gap-1 font-semibold text-(--green) underline underline-offset-4">
                Send me a topic
                <ArrowUpRight size={14} aria-hidden="true" />
              </DestinationLink>
              . If you need help with a specific project,{" "}
              <Link
                href="/hire/"
                className="font-semibold text-(--green) underline underline-offset-4">
                tell me what you’re working on
              </Link>
              .
            </p>

          </div>

        </div>

      </section>
      <section className="shell py-16 md:py-20" aria-labelledby="learning-notes-title">

        <SectionHeading eyebrow="TAKE AN IDEA WITH YOU" title={<span id="learning-notes-title">A few notes from the workbench.</span>} description="Short explanations you can come back to. Each one ends with something useful to try." />
        <div className="mt-8 grid gap-5 md:grid-cols-3">{notes.map((note) => <NoteCard key={note.slug} note={note} />)}</div>
        <Link href="/notes/" className="text-link mt-7">All notes &amp; resources<ArrowUpRight size={17} /></Link>
        
      </section>
      <ActionBanner
        title="Learning is better when you build something."
        description="Have an idea you want to turn into a website, a Python tool, or a working app? Let’s talk through a practical first version."/>

    </main>
  );
}
