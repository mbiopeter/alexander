import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Braces,
  Code2,
  Coffee,
  MessageCircle,
  Play,
  Send,
} from "lucide-react";
import { Hero, SkillsStrip } from "@/components/hero";
import {
  ActionBanner,
  Reveal,
  SectionHeading,
  ServiceCard,
} from "@/components/page-ui";
import { DestinationLink } from "@/components/destination-link";
import { ProjectCard } from "@/components/projects/project-card";
import { MbiotradeFeature } from "@/components/mbiotrade-feature";
import { services } from "@/data/services";
import { projects } from "@/data/projects";

const steps = [
  {
    icon: MessageCircle,
    title: "Start with a conversation",
    text: "Tell me what you want to build, improve, or fix. A few notes and a WhatsApp message are enough to start.",
  },
  {
    icon: Code2,
    title: "Make a clear plan",
    text: "We’ll agree on the scope, approach, timing, and cost, then work through the details together.",
  },
  {
    icon: Send,
    title: "Build, review, hand over",
    text: "See the work take shape, share your feedback, and get a clear handover when the agreed work is ready.",
  },
];

export function HomePage() {
  const featured = ["web-development", "python-django", "debugging"];
  return (
    <main id="main" className="page-main">

      <Hero />
      <SkillsStrip />
      <section
        id="services"
        className="page-section shell home-services"
        aria-labelledby="home-services-title">

        <Reveal>

          <SectionHeading
            eyebrow="WHAT I CAN DO FOR YOU"
            title={
              <span id="home-services-title">
                From your first idea.
                <br />
                <span className="muted-heading">
                  To your next breakthrough.
                </span>
              </span>
            }
            description="A thoughtful website, a capable Python backend, or help with the code that just won’t cooperate. Let’s make something useful."
          />
        </Reveal>
        <div className="content-grid">

          {services
            .filter((service) => featured.includes(service.slug))
            .map((service) => (
              <Reveal key={service.slug}>
                <ServiceCard service={service} />
              </Reveal>
            ))}

        </div>
        <div className="section-endnote">

          <p>
            Also: custom software, Python automation, and ongoing maintenance.
          </p>
          <Link href="/services/" className="text-link">
            Explore all six services <ArrowRight size={17} />
          </Link>
        </div>

      </section>
      <section className="tinted-section" aria-labelledby="home-projects-title">

        <div className="shell page-section">

          <Reveal>

            <SectionHeading
              eyebrow="LESS TALK. MORE TRYING THINGS."
              title={
                <span id="home-projects-title">
                  Ideas you can interact with.
                </span>
              }
              description="Try a task planner, explore an API simulation, or tidy a CSV. Then follow the decisions, edge cases, and source code behind each demo."
            />

          </Reveal>
          <div className="content-grid">

            {projects.map((project) => (
              <Reveal key={project.slug}>
                <ProjectCard project={project} />
              </Reveal>
            ))}

          </div>
          <Reveal>
            <MbiotradeFeature />
          </Reveal>
          <div className="section-endnote">

            <p>
              The three interactive demos were built for this site. mbioTraders
              is a separate signal-only application.
            </p>
            <Link href="/projects/" className="text-link">
              View the project gallery <ArrowRight size={17} />
            </Link>

          </div>

        </div>

      </section>
      <section
        className="page-section shell"
        aria-labelledby="home-process-title">

        <SectionHeading
          eyebrow="WORKING TOGETHER"
          title={
            <span id="home-process-title">
              A simple path from idea to done.
            </span>
          }
          description="Good communication makes the work better. Here’s how we can get started."
        />
        <div className="content-grid home-process-grid">

          {steps.map(({ icon: Icon, title, text }, index) => (
            <Reveal className="process-tile" key={title}>

              <div className="process-tile-top">
                <Icon size={25} strokeWidth={1.6} />
                <span>0{index + 1}</span>
              </div>
              <h3>{title}</h3>
              <p>{text}</p>

            </Reveal>

          ))}
        </div>

      </section>
      <section
        className="page-section shell"
        aria-labelledby="home-learn-title">

        <Reveal className="creator-feature">

          <div className="creator-feature-art" aria-hidden="true">

            <span className="creator-spark">✳</span>
            <div className="creator-code">

              <div>

                <Braces size={17} />
                <span>one-small-lesson.tsx</span>

              </div>
              <p>

                <span>learn</span>
                <b>(</b>oneThing<b>);</b>
                <br />
                <span>try</span>
                <b>(</b>something<b>);</b>
                <br />
                <span>build</span>
                <b>(</b>confidence<b>);</b>

              </p>
              <span className="creator-code-note">

                <span className="status-dot" /> SMALL STEPS. REAL PROGRESS.

              </span>

            </div>
            <span className="creator-play">

              <Play size={23} fill="currentColor" />

            </span>

          </div>
          <div className="creator-feature-copy">

            <p className="eyebrow">FROM YOUR FEED TO YOUR FIRST BUILD</p>
            <h2 id="home-learn-title">

              A little explanation.
              <br />
              <span className="muted-heading">A lot more possibility.</span>

            </h2>
            <p>
              I share short coding tutorials on TikTok. Here, you can go one
              step further: explore a small example, change something, and see
              what happens.
            </p>
            <div className="intro-actions">

              <Link href="/playground/" className="button button-primary">
                Try the playground <ArrowUpRight size={18} />
              </Link>
              <DestinationLink destination="tiktok" className="text-link">
                Find me on TikTok <ArrowUpRight size={16} />
              </DestinationLink>

            </div>

          </div>

        </Reveal>

      </section>
      <section
        className="shell home-support-note"
        aria-label="Support the tutorials">

        <Coffee size={23} strokeWidth={1.6} />
        <p>
          Found something useful? A little coffee helps keep the tutorials
          coming.
        </p>
        <DestinationLink
          destination="paystack"
          fallbackHref="/support/"
          className="text-link">
          Buy me a coffee <ArrowUpRight size={17} />
        </DestinationLink>

      </section>

      <ActionBanner />

    </main>
  );
}
