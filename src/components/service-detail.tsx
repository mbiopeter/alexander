import Link from "next/link";
import { ArrowUpRight, Check, MessageCircle } from "lucide-react";
import { services, type Service } from "@/data/services";
import {
  ActionBanner,
  PageIntro,
  Reveal,
  SectionHeading,
  ServiceCard,
  ServiceIcon,
} from "@/components/page-ui";
import { DestinationLink } from "@/components/destination-link";

const serviceExamples: Record<string, {
  title: string;
  scenario: string;
  connection: string;
  projectSlug: string;
  projectLabel: string;
  related: string[];
}> = {
  "web-development": {
    title: "A clear path through a useful website.",
    scenario: "You have an offer to explain and one important thing visitors should be able to do. We can shape the pages around that journey, then make the forms and interactions work across screen sizes.",
    connection: "Focusboard is a small frontend example of understandable controls, useful validation, and visible state changes.",
    projectSlug: "focusboard",
    projectLabel: "Explore the Focusboard demo",
    related: ["python-django", "custom-software", "maintenance"],
  },
  "python-django": {
    title: "An interface that needs reliable data behind it.",
    scenario: "Your product needs records, permissions, or an API for another interface. We can define the data and response contract, implement it in Django, and check the important success and error paths.",
    connection: "The Django API Lab illustrates response contracts and validation. It is a browser simulation for learning, with a separate Python sketch.",
    projectSlug: "django-api-lab",
    projectLabel: "Explore the API simulation",
    related: ["web-development", "python-automation", "maintenance"],
  },
  "custom-software": {
    title: "A repeated workflow that needs a better home.",
    scenario: "You are moving the same information between notes, spreadsheets, and messages. We can identify the core task and build a focused first version with the fields, states, and handover your workflow needs.",
    connection: "Focusboard shows a small workflow from creating a task to tracking its completion. Its build notes explain where local storage fits and where a backend would be needed.",
    projectSlug: "focusboard",
    projectLabel: "Read the Focusboard build notes",
    related: ["python-django", "web-development", "python-automation"],
  },
  "python-automation": {
    title: "The same cleanup before every report.",
    scenario: "A recurring CSV or spreadsheet needs predictable cleanup before it is useful. We can agree the input rules, expected output, and exceptions, then turn those steps into a repeatable Python workflow.",
    connection: "Data Tidy is a browser tool that makes a cleanup process visible. Its parsing and export choices are a practical example of the questions to settle before automating.",
    projectSlug: "data-tidy",
    projectLabel: "Explore the CSV cleanup demo",
    related: ["custom-software", "python-django", "debugging"],
  },
  debugging: {
    title: "A small input that breaks the expected result.",
    scenario: "A form, API, or script works with one example but fails with another. We can isolate the smallest failing case, trace the cause, and check a focused fix against that case and nearby edge cases.",
    connection: "Data Tidy’s build notes show why quoted commas, blank rows, and uneven fields need explicit handling. The downloadable source includes tests for its parsing and cleanup helpers.",
    projectSlug: "data-tidy",
    projectLabel: "Inspect the Data Tidy build notes",
    related: ["maintenance", "python-django", "web-development"],
  },
  maintenance: {
    title: "An improvement that respects what already works.",
    scenario: "An existing project needs a new field, a clearer screen, or a dependency update. We can map the affected behaviour, agree the change, and check the paths your users already rely on.",
    connection: "Focusboard is a small example of state worth preserving: tasks, priorities, and completion. Its build notes explain how saved records are checked before being restored.",
    projectSlug: "focusboard",
    projectLabel: "See the Focusboard build decisions",
    related: ["debugging", "web-development", "custom-software"],
  },
};

export function ServiceDetail({ service }: { service: Service }) {
  const example = serviceExamples[service.slug];
  const related = (example?.related ?? [])
    .map((slug) => services.find((item) => item.slug === slug))
    .filter((item): item is Service => Boolean(item));

  return (
    <main id="main" className="page-main">

      <PageIntro
        eyebrow={`SERVICES / ${service.shortTitle.toUpperCase()}`}
        title={service.title}
        description={service.summary}>

        <Link
          href={`/hire/?service=${service.slug}`}
          className="button button-primary">
          Discuss this service <ArrowUpRight size={18} />
        </Link>
        <Link href="/services/" className="button button-outline">
          All services
        </Link>

      </PageIntro>
      <section
        className="page-section shell"
        aria-labelledby="service-description-title">

        <div className="split-layout items-start">

          <div>

            <Reveal>

              <p className="eyebrow">WHAT WE CAN WORK ON</p>
              <h2
                id="service-description-title"
                className="mb-5 mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                {service.tagline}
              </h2>
              <p className="body-copy">{service.description}</p>

            </Reveal>
            {example && (
              <article className="info-card mt-10">

                <p className="eyebrow mb-4">WHAT THIS COULD LOOK LIKE</p>
                <h3 className="mb-4 text-xl font-semibold tracking-tight">{example.title}</h3>
                <p className="mb-5 text-sm leading-7 text-(--muted)">{example.scenario}</p>
                <p className="mb-5 border-t border-(--line) pt-5 text-sm leading-7 text-(--muted)">{example.connection}</p>
                <Link href={`/projects/${example.projectSlug}/#behind-the-build`} className="text-link">
                  {example.projectLabel} <ArrowUpRight size={16} aria-hidden="true" />
                </Link>

              </article>
            )}
            <Reveal className="mt-12">

              <h3 className="mb-5 text-xl font-semibold tracking-tight">
                What your project can include
              </h3>
              <ul className="feature-list">
                {service.deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-3">

                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--surface-soft) text-(--green)">
                      <Check size={15} aria-hidden="true" />
                    </span>
                    <span>{item}</span>

                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm leading-relaxed text-(--muted)">
                These are possible deliverables, not a fixed package. We’ll
                confirm the features, access, responsibilities, and handover in
                the project scope.
              </p>

            </Reveal>
            <Reveal className="mt-12">

              <h3 className="mb-4 text-xl font-semibold tracking-tight">
                Tools that fit the job
              </h3>
              <ul className="tag-list" aria-label="Relevant technologies">
                {service.stack.map((tool) => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
              <p className="mt-5 text-sm leading-relaxed text-(--muted)">
                The final stack depends on your requirements and the project you
                already have. A focused solution is often the best place to
                start.
              </p>

            </Reveal>

          </div>
          <aside
            className="detail-sidebar info-card lg:sticky lg:top-28"
            aria-labelledby="service-fit-title">

            <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-(--surface-soft) text-(--green)">
              <ServiceIcon name={service.icon} size={27} />
            </div>
            <p className="eyebrow mb-3">A GOOD FIT FOR</p>
            <h3 id="service-fit-title" className="mb-5 text-xl font-semibold">
              Your next practical step.
            </h3>
            <ul className="space-y-3 text-sm leading-relaxed text-(--muted)">
              {service.idealFor.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-(--green)"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-7 border-t border-(--line) pt-6">

              <p className="mb-5 text-sm leading-relaxed text-(--muted)">
                Share a short brief. We’ll discuss scope, cost, and timing
                before starting.
              </p>
              <Link
                href={`/hire/?service=${service.slug}`}
                className="button button-accent w-full">
                Start a conversation <ArrowUpRight size={17} />
              </Link>
              <DestinationLink
                destination="whatsapp"
                message={`Hi Mbiopeter! I’m interested in ${service.title.toLowerCase()}. Can we discuss my project?`}
                className="mt-5 flex items-center justify-center gap-2 text-sm font-medium">
                <MessageCircle size={16} /> Or ask on WhatsApp{" "}
                <ArrowUpRight size={15} />

              </DestinationLink>

            </div>

          </aside>

        </div>

      </section>
      <section className="page-section shell" aria-label="Related services">

        <SectionHeading
          eyebrow="MORE WAYS TO HELP"
          title="One idea can need a few different skills."
          description="Your project may combine a website, an API, automation, or a focused fix. We can scope the pieces together."/>
        <div className="content-grid">
          {related.map((item) => (
            <ServiceCard key={item.slug} service={item} />
          ))}
        </div>
      </section>
      <ActionBanner
        title="Let’s work out what you need."
        description="A short message is enough to get started. Bring your idea, your questions, or the problem you want to solve."/>
        
    </main>
  );
}
