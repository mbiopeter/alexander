import Link from "next/link";
import { ArrowUpRight, Check, MessageCircle } from "lucide-react";
import { services } from "@/data/services";
import { makeMetadata } from "@/lib/metadata";
import {
  ActionBanner,
  PageIntro,
  Reveal,
  SectionHeading,
  ServiceCard,
} from "@/components/page-ui";
import { DestinationLink } from "@/components/destination-link";

export const metadata = makeMetadata(
  "Development services",
  "Web development, Python and Django applications, custom software, automation, debugging, and maintenance by Mbiopeter.",
  "/services/",
);

export default function ServicesPage() {
  return (
    <main id="main" className="page-main">
      <PageIntro
        eyebrow="SERVICES / FROM IDEA TO WORKING PRODUCT"
        title="Good ideas deserve the right support."
        description="A new website, a Python application, a repetitive task, or a stubborn bug. Start with the problem you want to solve, and we’ll work out the right way forward.">

        <Link href="/hire/" className="button button-primary">
          Tell me about your project <ArrowUpRight size={18} />
        </Link>
        <a href="#explore-services" className="button button-outline">
          Explore the services
        </a>
      </PageIntro>
      <section
        id="explore-services"
        className="page-section shell"
        aria-label="Explore development services">

        <SectionHeading
          eyebrow="HOW I CAN HELP"
          title="Build it. Improve it. Make it work."
          description="Choose a service to see what it can include. We’ll agree on the actual scope, timeline, and price before work begins."/>
        <div className="content-grid">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>

      </section>
      <section
        className="page-section shell"
        aria-labelledby="starting-point-title">

        <Reveal className="split-layout">

          <div>

            <p className="eyebrow">A SIMPLE STARTING POINT</p>
            <h2
              id="starting-point-title"
              className="mb-5 mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              You don’t need to know the technical answer.
            </h2>
            <p className="body-copy">
              Tell me what you want to achieve, what is getting in the way, and
              what you already have. A rough idea is enough to start a useful
              conversation.
            </p>
            <DestinationLink
              destination="whatsapp"
              message="Hi Mbiopeter! I’m not sure which service I need. Can I tell you about my project?"
              className="button button-outline mt-7">

              <MessageCircle size={18} /> Ask on WhatsApp{" "}
              <ArrowUpRight size={17} />

            </DestinationLink>

          </div>
          <div className="info-card">

            <p className="eyebrow mb-5">HELPFUL THINGS TO SHARE</p>
            <ul className="feature-list">
              {[
                "What you want the website, tool, or script to do",
                "Who will use it and what matters most to them",
                "Any existing project, design, or example you can share",
                "Your preferred timing and any budget constraints",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">

                  <Check
                    size={18}
                    className="mt-1 shrink-0 text-(--green)"
                    aria-hidden="true"/>
                  <span>{item}</span>

                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-[var(--muted)]">
              For debugging, include the error and the steps that trigger it.
              Keep passwords, API keys, and private data out of your first
              message.
            </p>

          </div>

        </Reveal>

      </section>
      <ActionBanner
        title="Have something in mind?"
        description="Let’s turn a few notes into a clear next step. All project enquiries go straight to WhatsApp."/>
        
    </main>
  );
}
