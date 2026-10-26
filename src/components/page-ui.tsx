"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Bug,
  Code2,
  Coffee,
  Database,
  Layers3,
  Settings2,
  Workflow,
} from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import { DestinationLink } from "@/components/destination-link";
import type { Service } from "@/data/services";

export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className={`${className} ${inView ? "reveal-in" : ""}`}>
      {children}
    </div>
  );
}

export function PageIntro({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className="page-intro shell">

      <Reveal>

        <p className="eyebrow">
          <span aria-hidden="true">✳</span>
          {eyebrow}
        </p>
        <h1>{title}</h1>
        <p className="intro-description">{description}</p>
        {children && <div className="intro-actions">{children}</div>}
      </Reveal>
      <span className="intro-decoration" aria-hidden="true">{`{ }`}</span>

    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
}) {
  return (
    <div className="section-header">

      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
      </div>
      {description && <p>{description}</p>}

    </div>
  );
}

export function ActionBanner({
  title = "Good work starts with a conversation.",
  description = "Tell me what you want to build, fix, or simplify. We’ll find the right starting point.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="shell action-banner-wrap">

      <div className="action-banner">

        <div>

          <p className="eyebrow">HAVE SOMETHING IN MIND?</p>
          <h2>{title}</h2>
          <p>{description}</p>

        </div>
        <div className="action-banner-buttons">

          <Link href="/hire/" className="button button-accent">
            Hire me <ArrowUpRight size={18} />
          </Link>
          <DestinationLink
            destination="paystack"
            fallbackHref="/support/"
            className="button button-on-dark">
            <Coffee size={17} /> Buy me a coffee
          </DestinationLink>

        </div>

      </div>

    </section>
  );
}

const serviceIcons = {
  web: Code2,
  django: Database,
  software: Layers3,
  automation: Workflow,
  debugging: Bug,
  maintenance: Settings2,
};
export function ServiceIcon({
  name,
  className = "",
  size = 25,
}: {
  name: Service["icon"];
  className?: string;
  size?: number;
}) {
  const Icon = serviceIcons[name];
  return <Icon size={size} className={className} strokeWidth={1.7} />;
}

export function ServiceCard({ service }: { service: Service }) {
  return (
    <article
      className={`service-card service-${service.icon === "django" || service.icon === "web" ? "green" : service.icon === "debugging" || service.icon === "automation" ? "orange" : "violet"}`}>

      <div className="flex items-center justify-between gap-4">

        <span className="service-icon">
          <ServiceIcon name={service.icon} />
        </span>
        <ArrowUpRight size={18} className="text-(--muted)" />

      </div>
      <h3>
        <Link href={`/services/${service.slug}/`}>{service.title}</Link>
      </h3>
      <p>{service.summary}</p>
      <ul className="service-tags">
        {service.stack.slice(0, 3).map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
      <Link href={`/services/${service.slug}/`} className="service-link">
        Explore this service <ArrowRight size={17} />
      </Link>

    </article>
  );
}
