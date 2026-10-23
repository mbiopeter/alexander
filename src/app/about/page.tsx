import Link from "next/link";
import {
  ArrowUpRight,
  Braces,
  Check,
  Code2,
  Heart,
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
                My services cover the interface, the application logic, and the
                work of getting existing code moving again. I like to start with
                the goal, work through the details, and keep the next step
                clear.
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
