import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  ClipboardList,
  Code2,
  MessageCircle,
  PackageCheck,
} from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { DestinationLink } from "@/components/destination-link";
import { PageIntro, Reveal, SectionHeading } from "@/components/page-ui";
import { services } from "@/data/services";
import { makeMetadata } from "@/lib/metadata";

export const metadata = makeMetadata(
  "Hire Alexender",
  "Discuss a website, Python and Django application, automation, or debugging project with Alexender. Start with a short brief and continue on WhatsApp.",
  "/hire/",
);

const expectations = [
  {
    icon: ClipboardList,
    title: "A clear scope first",
    text: "We start with your goal, the current setup, and what a useful result looks like. The scope, cost, and timeline are agreed before work begins.",
  },
  {
    icon: Code2,
    title: "Work you can follow",
    text: "We agree on the important milestones and discuss changes as they come up, so you know what is being built and why.",
  },
  {
    icon: PackageCheck,
    title: "A considered handover",
    text: "Your project includes the agreed source files and practical notes for running, using, or maintaining the work.",
  },
];

export default function HirePage() {
  return (
    <main id="main" className="page-main">
      <PageIntro
        eyebrow="LET’S WORK TOGETHER"
        title="Let’s make your next idea work."
        description="A new website, a Python-powered tool, a stubborn bug, or a workflow that needs simplifying. Tell me what you have in mind and we’ll work out a practical next step."
      >
        <a href="#project-brief" className="button button-primary">
          Start a project brief
          <ArrowUpRight size={18} aria-hidden="true" />
        </a>
        <DestinationLink destination="whatsapp" className="button button-quiet">
          <MessageCircle size={18} aria-hidden="true" />
          Chat directly
        </DestinationLink>
      </PageIntro>

      <section className="shell pb-20 md:pb-28" aria-labelledby="brief-title">
        <div className="grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow">A GOOD PLACE TO START</p>
            <h2 id="brief-title">
              A little context.
              <br />
              <span className="muted-heading">A useful conversation.</span>
            </h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-[var(--muted)]">
              You do not need a finished specification. A few sentences about
              the result you want are enough to start.
            </p>
            <ul className="mt-7 space-y-5">
              {[
                [
                  "The goal",
                  "What should the website, app, or script help you do?",
                ],
                [
                  "The starting point",
                  "Is this a new idea or an existing project that needs attention?",
                ],
                [
                  "The priorities",
                  "What matters most: a particular feature, a deadline, or a simpler workflow?",
                ],
              ].map(([title, text]) => (
                <li key={title} className="flex gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-ink)]">
                    <Check size={12} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="mb-1 text-sm font-semibold">{title}</p>
                    <p className="mb-0 max-w-sm text-sm leading-6 text-[var(--muted)]">
                      {text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-9 border-t border-[var(--line)] pt-7">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
                Not sure which service fits?
              </p>
              <div className="flex flex-wrap gap-2">
                {services.map((service) => (
                  <Link
                    key={service.slug}
                    href={`/services/${service.slug}/`}
                    className="rounded-full border border-[var(--line)] px-3 py-2 text-xs text-[var(--muted)] transition-colors hover:border-[var(--green)] hover:text-[var(--text)]"
                  >
                    {service.shortTitle}
                  </Link>
                ))}
              </div>
            </div>
            <DestinationLink destination="whatsapp" className="text-link mt-8">
              <MessageCircle size={17} aria-hidden="true" />
              Prefer a quick message? Say hello
              <ArrowUpRight size={16} aria-hidden="true" />
            </DestinationLink>
          </Reveal>

          <div id="project-brief" className="scroll-mt-28">
            <p className="eyebrow mb-4">YOUR PROJECT BRIEF</p>
            <ContactForm />
            <p className="mt-4 px-2 text-center text-xs leading-6 text-[var(--muted)]">
              The service and project description are all you need. Add the
              optional details only if they help explain the project.
            </p>
          </div>
        </div>
      </section>

      <section
        className="border-y border-[var(--line)] bg-[var(--surface-soft)] py-16 md:py-24"
        aria-label="What to expect"
      >
        <div className="shell">
          <SectionHeading
            eyebrow="WHAT TO EXPECT"
            title="Straightforward from the first message."
            description="Good work starts with a shared understanding of the problem and a clear plan for solving it."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {expectations.map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-7"
              >
                <Icon
                  size={24}
                  className="mb-6 text-[var(--green)]"
                  aria-hidden="true"
                />
                <h3 className="mb-3 text-lg font-semibold">{title}</h3>
                <p className="mb-0 text-sm leading-7 text-[var(--muted)]">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="shell py-16 md:py-24"
        aria-labelledby="before-you-ask-title"
      >
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="eyebrow">A FEW QUICK ANSWERS</p>
            <h2 id="before-you-ask-title">
              Before we
              <br />
              <span className="muted-heading">get started.</span>
            </h2>
          </div>
          <div className="faq-list">
            {[
              [
                "Can you help with an existing project?",
                "Yes. Describe what is happening, what you expected, and the tools the project uses. We can start by reviewing the problem and agreeing on a focused scope.",
              ],
              [
                "What if I do not know my budget yet?",
                "Leave the budget field blank or write “let’s discuss.” Once the requirements are clearer, we can talk through the scope and cost.",
              ],
              [
                "Does sending a brief commit me to a project?",
                "No. It starts a conversation. We agree on the work, price, and timeline before starting.",
              ],
              [
                "Is developer support a project payment?",
                "The Support page is for optional contributions to my tutorials and creative work. Project fees are discussed separately as part of an agreed scope.",
              ],
            ].map(([question, answer], index) => (
              <details key={question} className="faq-item" name="hire-faq">
                <summary>
                  <span className="faq-index">0{index + 1}</span>
                  <span>{question}</span>
                  <span className="ml-auto text-lg" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
