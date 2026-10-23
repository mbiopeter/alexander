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

export function ServiceDetail({ service }: { service: Service }) {
  const related = services
    .filter((item) => item.slug !== service.slug)
    .slice(0, 3);

  return (
    <main id="main" className="page-main">
      <PageIntro
        eyebrow={`SERVICES / ${service.shortTitle.toUpperCase()}`}
        title={service.title}
        description={service.summary}
      >
        <Link
          href={`/hire/?service=${service.slug}`}
          className="button button-primary"
        >
          Discuss this service <ArrowUpRight size={18} />
        </Link>
        <Link href="/services/" className="button button-outline">
          All services
        </Link>
      </PageIntro>

      <section
        className="page-section shell"
        aria-labelledby="service-description-title"
      >
        <div className="split-layout items-start">
          <div>
            <Reveal>
              <p className="eyebrow">WHAT WE CAN WORK ON</p>
              <h2
                id="service-description-title"
                className="mb-5 mt-4 text-3xl font-semibold tracking-tight sm:text-4xl"
              >
                {service.tagline}
              </h2>
              <p className="body-copy">{service.description}</p>
            </Reveal>

            <Reveal className="mt-12">
              <h3 className="mb-5 text-xl font-semibold tracking-tight">
                What your project can include
              </h3>
              <ul className="feature-list">
                {service.deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--surface-soft)] text-[var(--green)]">
                      <Check size={15} aria-hidden="true" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm leading-relaxed text-[var(--muted)]">
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
              <p className="mt-5 text-sm leading-relaxed text-[var(--muted)]">
                The final stack depends on your requirements and the project you
                already have. A focused solution is often the best place to
                start.
              </p>
            </Reveal>
          </div>

          <aside
            className="detail-sidebar info-card lg:sticky lg:top-28"
            aria-labelledby="service-fit-title"
          >
            <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface-soft)] text-[var(--green)]">
              <ServiceIcon name={service.icon} size={27} />
            </div>
            <p className="eyebrow mb-3">A GOOD FIT FOR</p>
            <h3 id="service-fit-title" className="mb-5 text-xl font-semibold">
              Your next practical step.
            </h3>
            <ul className="space-y-3 text-sm leading-relaxed text-[var(--muted)]">
              {service.idealFor.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--green)]"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-7 border-t border-[var(--line)] pt-6">
              <p className="mb-5 text-sm leading-relaxed text-[var(--muted)]">
                Share a short brief. We’ll discuss scope, cost, and timing
                before starting.
              </p>
              <Link
                href={`/hire/?service=${service.slug}`}
                className="button button-accent w-full"
              >
                Start a conversation <ArrowUpRight size={17} />
              </Link>
              <DestinationLink
                destination="whatsapp"
                message={`Hi Alexender! I’m interested in ${service.title.toLowerCase()}. Can we discuss my project?`}
                className="mt-5 flex items-center justify-center gap-2 text-sm font-medium"
              >
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
          description="Your project may combine a website, an API, automation, or a focused fix. We can scope the pieces together."
        />
        <div className="content-grid">
          {related.map((item) => (
            <ServiceCard key={item.slug} service={item} />
          ))}
        </div>
      </section>

      <ActionBanner
        title="Let’s work out what you need."
        description="A short message is enough to get started. Bring your idea, your questions, or the problem you want to solve."
      />
    </main>
  );
}
