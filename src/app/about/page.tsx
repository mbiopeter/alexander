import Link from "next/link";
import {
  ArrowUpRight,
  Braces,
  BriefcaseBusiness,
  Check,
  Code2,
  Download,
  GitBranch,
  Heart,
  Mail,
  MessageCircle,
  Play,
} from "lucide-react";
import { makeMetadata } from "@/lib/metadata";
import {
  ActionBanner,
  PageIntro,
  Reveal,
  SectionHeading,
} from "@/components/page-ui";
import { DestinationLink } from "@/components/destination-link";
import { getCvUrl, getEmailDraftUrl, getGitHubUrl, getLinkedInUrl } from "@/lib/links";

export const metadata = makeMetadata(
  "About Alexender",
  "Meet Alexender: a developer and creator building websites, Python and Django software, and short coding tutorials for TikTok.",
  "/about/",
);

const principles = [
  {
    icon: MessageCircle,
    title: "Start with the real need",
    text: "A useful project starts with a clear conversation. What should it do, who is it for, and what would make it worth building?",
  },
  {
    icon: Code2,
    title: "Make the code understandable",
    text: "Readable structure, practical choices, and a clear handover matter. You should be able to understand what was built and how to use it.",
  },
  {
    icon: Heart,
    title: "Share what makes things click",
    text: "A small explanation can remove a big roadblock. That is the idea behind my short tutorials and the interactive lessons on this site.",
  },
];

export default function AboutPage() {
  const githubUrl = getGitHubUrl();
  const linkedinUrl = getLinkedInUrl();
  const cvUrl = getCvUrl();
  const emailUrl = getEmailDraftUrl();
  const hasProfileLinks = Boolean(githubUrl || linkedinUrl || cvUrl || emailUrl);
  return (
    <main id="main" className="page-main">
      <PageIntro
        eyebrow="ABOUT / THE PERSON BEHIND THE CODE"
        title="A developer’s mind. A creator’s heart."
        description="I’m Alexender. I build websites and software, help untangle tricky code, and share short coding tutorials on TikTok."
      >
        <Link href="/hire/" className="button button-primary">
          Let’s work together <ArrowUpRight size={18} />
        </Link>
        <Link href="/learn/" className="button button-outline">
          <Play size={16} /> Learn with me
        </Link>
      </PageIntro>

      <section
        className="page-section shell"
        aria-labelledby="about-intro-title"
      >
        <Reveal className="split-layout items-center">
          <div>
            <p className="eyebrow">BUILD THINGS. EXPLAIN THINGS.</p>
            <h2
              id="about-intro-title"
              className="mb-6 mt-4 text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              Good code should lead to something useful.
            </h2>
            <div className="body-copy space-y-5">
              <p>
                That might be a website that makes a business easier to find, a
                Django application that gives a team a useful tool, or a Python
                script that takes a repetitive task off someone’s hands.
              </p>
              <p>
                I like small, understandable steps: make the main interaction
                work, try the awkward inputs, and explain the decisions along
                the way. The projects on this site give you a way to explore
                that approach for yourself.
              </p>
              <p>
                I also create short tutorials for people learning to code. The
                mini playground on this site follows the same idea: try
                something small, see what changes, and understand why it works.
              </p>
            </div>
            <DestinationLink
              destination="tiktok"
              className="button button-outline mt-7"
            >
              Find me on TikTok <ArrowUpRight size={17} />
            </DestinationLink>
            {hasProfileLinks && (
              <nav className="mt-7 flex flex-wrap gap-x-6 gap-y-4 border-t border-[var(--line)] pt-6" aria-label="Alexender’s profiles and contact">
                {githubUrl && (
                  <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-link">
                    <GitBranch size={16} aria-hidden="true" /> GitHub <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                )}
                {linkedinUrl && (
                  <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-link">
                    <BriefcaseBusiness size={16} aria-hidden="true" /> LinkedIn <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                )}
                {cvUrl && (
                  <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="text-link">
                    <Download size={16} aria-hidden="true" /> View my CV <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                )}
                {emailUrl && (
                  <a href={emailUrl} className="text-link">
                    <Mail size={16} aria-hidden="true" /> Send an email
                  </a>
                )}
              </nav>
            )}
          </div>

          <div className="overflow-hidden rounded-3xl border border-[var(--line)] bg-[#141c19] text-[#e8eee9]">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 text-xs text-[#a5b7ae]">
              <span className="flex items-center gap-2">
                <Braces size={16} /> a-little-about-me.ts
              </span>
              <span>BUILD / SHARE / REPEAT</span>
            </div>
            <div className="p-6 sm:p-9">
              <span
                className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#c8ee72] text-4xl font-bold tracking-tighter text-[#172313]"
                aria-hidden="true"
              >
                a.
              </span>
              <p className="mb-2 text-sm text-[#b7d4c3]">
                const developer = &#123;
              </p>
              <dl className="space-y-5 border-l border-white/15 pl-5 text-sm">
                <div>
                  <dt className="mb-1 text-[#a5b7ae]">name</dt>
                  <dd className="font-medium text-[#c8ee72]">
                    &quot;Alexender&quot;
                  </dd>
                </div>
                <div>
                  <dt className="mb-1 text-[#a5b7ae]">focus</dt>
                  <dd className="font-medium">
                    Websites, software &amp; practical fixes
                  </dd>
                </div>
                <div>
                  <dt className="mb-1 text-[#a5b7ae]">also</dt>
                  <dd className="font-medium">
                    Short tutorials. Useful explanations.
                  </dd>
                </div>
              </dl>
              <p className="mt-5 text-sm text-[#b7d4c3]">&#125;;</p>
              <div className="mt-8 flex items-center gap-2 border-t border-white/10 pt-5 text-xs text-[#b7d4c3]">
                <Check size={14} className="text-[#c8ee72]" /> A little code. A
                lot of possibility.
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="tinted-section" aria-labelledby="about-work-title">
        <div className="shell page-section">
          <SectionHeading
            eyebrow="A SMALL WINDOW INTO MY WORK"
            title={<span id="about-work-title">Build it. Try it. Explain it.</span>}
            description="I want this site to be useful while you get to know my work. The demos are small on purpose: you can try an interaction, read the reasoning, and look at the source."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                title: "Make a useful first version",
                text: "Focusboard starts with a task, a note, and a clear next step. It keeps the scope small enough to understand from the first visit.",
                href: "/projects/focusboard/#behind-the-build",
                label: "Inside Focusboard",
              },
              {
                title: "Pay attention to the edges",
                text: "Data Tidy has to handle more than neat rows. Its build notes cover quotes, duplicate records, uneven columns, and export choices.",
                href: "/projects/data-tidy/#behind-the-build",
                label: "Inside Data Tidy",
              },
              {
                title: "Leave room to explore",
                text: "The API lab makes responses visible. The lessons and coding playground let you change something, check the result, and ask why it happened.",
                href: "/notes/",
                label: "Read the practical notes",
              },
            ].map((item) => (
              <article key={item.title} className="info-card flex flex-col">
                <h3 className="mb-4 text-xl font-semibold tracking-tight">{item.title}</h3>
                <p className="mb-6 text-sm leading-7 text-[var(--muted)]">{item.text}</p>
                <Link href={item.href} className="text-link mt-auto">
                  {item.label} <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section shell" aria-label="My approach">
        <SectionHeading
          eyebrow="HOW I APPROACH THE WORK"
          title="Keep the purpose clear."
          description="A few simple principles guide the way I build, explain, and collaborate."
        />
        <div className="content-grid">
          {principles.map(({ icon: Icon, title, text }, index) => (
            <Reveal key={title} className="info-card">
              <div className="mb-7 flex items-center justify-between">
                <Icon size={25} className="text-[var(--green)]" />
                <span className="text-sm text-[var(--muted)]">
                  0{index + 1}
                </span>
              </div>
              <h3 className="mb-3 text-xl font-semibold tracking-tight">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--muted)]">
                {text}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="page-section shell" aria-labelledby="creator-title">
        <Reveal className="info-card flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <p className="eyebrow">PART OF THE JOURNEY</p>
            <h2
              id="creator-title"
              className="mb-3 mt-3 text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              Here to learn? You’re welcome too.
            </h2>
            <p className="body-copy">
              Explore the short lessons, try the examples, or follow along on
              TikTok. If the tutorials help you, there is an optional way to
              support the next one.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col">
            <Link href="/learn/" className="button button-primary">
              Explore the lessons <ArrowUpRight size={17} />
            </Link>
            <Link href="/support/" className="button button-outline">
              <Heart size={16} /> Support the tutorials
            </Link>
          </div>
        </Reveal>
      </section>

      <ActionBanner
        title="What would you like to build?"
        description="Tell me about your idea or the problem you’re working through. We can start with a simple WhatsApp conversation."
      />
    </main>
  );
}
