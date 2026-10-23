import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Coffee,
  Heart,
  Lightbulb,
  MessageCircle,
  Play,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { DestinationLink } from "@/components/destination-link";
import { PageIntro, Reveal, SectionHeading } from "@/components/page-ui";
import { makeMetadata } from "@/lib/metadata";

export const metadata = makeMetadata(
  "Support the developer",
  "Support Alexender’s short coding tutorials and development work with an optional contribution through Paystack. Choose an amount on the hosted payment page.",
  "/support/",
);

export default function SupportPage() {
  return (
    <main id="main" className="page-main">
      <PageIntro
        eyebrow="SUPPORT THE CREATOR"
        title="A small thank-you. A little more possibility."
        description="If a tutorial helped something click, or a shared idea moved your project forward, you can support the time that goes into making the next one."
      />

      <section
        id="support"
        className="shell pt-12 pb-20 md:pt-16 md:pb-28"
        aria-labelledby="support-title"
      >
        <Reveal className="support-card">
          <div className="support-art" aria-hidden="true">
            <span className="support-star star-a">✳</span>
            <span className="support-star star-b">+</span>
            <div className="coffee-orbit orbit-one" />
            <div className="coffee-orbit orbit-two" />
            <div className="coffee-cup">
              <div className="coffee-steam">
                <i />
                <i />
                <i />
              </div>
              <Coffee size={94} strokeWidth={1.4} />
              <Heart size={23} className="coffee-heart" fill="currentColor" />
            </div>
            <span className="coffee-note">
              A LITTLE SUPPORT GOES A LONG WAY
            </span>
          </div>
          <div className="support-copy">
            <p className="eyebrow">
              <Heart size={13} aria-hidden="true" />
              MADE WITH CURIOSITY. SHARED WITH YOU.
            </p>
            <h2 id="support-title">
              Enjoy the tutorials?
              <br />
              <span>Fuel the next one.</span>
            </h2>
            <p>
              A little support makes room for more tutorials, useful
              experiments, and sharing what I learn. Every contribution is your
              choice, at an amount that works for you.
            </p>
            <DestinationLink
              destination="paystack"
              className="button button-accent"
            >
              Buy me a coffee
              <Coffee size={18} aria-hidden="true" />
              <ArrowUpRight size={18} aria-hidden="true" />
            </DestinationLink>
            <div className="support-payment">
              <ShieldCheck size={15} aria-hidden="true" />
              <span>
                Choose your amount. Checkout with <strong>Paystack.</strong>
              </span>
            </div>
            <p className="support-small">
              Always optional. Always appreciated.
            </p>
          </div>
        </Reveal>
      </section>

      <section
        className="border-y border-(--line) bg-(--surface-soft) py-16 md:py-24"
        aria-label="What your support helps with"
      >
        <div className="shell">
          <SectionHeading
            eyebrow="BEHIND THE SHORT TUTORIALS"
            title="There’s a little work behind every “aha.”"
            description="Researching an idea, testing the code, and making the explanation clear all take time. Your support helps make space for that work."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: BookOpen,
                title: "Clearer explanations",
                text: "Time to turn a tricky topic into a short lesson with a useful, understandable example.",
              },
              {
                icon: Lightbulb,
                title: "More experiments",
                text: "Room to explore ideas, build small demos, and share what works along the way.",
              },
              {
                icon: Sparkles,
                title: "Practical resources",
                text: "More attention to the snippets, examples, and small details that make a lesson easier to use.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="rounded-2xl border border-(--line) bg-(--surface) p-7"
              >
                <Icon
                  size={24}
                  className="mb-6 text-(--green)"
                  aria-hidden="true"
                />
                <h3 className="mb-3 text-lg font-semibold">{title}</h3>
                <p className="mb-0 text-sm leading-7 text-(--muted)">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="shell py-16 md:py-24"
        aria-labelledby="support-steps-title"
      >
        <p className="eyebrow">SIMPLE FROM START TO FINISH</p>
        <h2 id="support-steps-title">Support in a few steps.</h2>
        <div className="mt-9 grid gap-8 md:grid-cols-3">
          {[
            [
              "01",
              "Open the payment page",
              "The support button takes you to my Paystack-hosted page.",
            ],
            [
              "02",
              "Choose your amount",
              "Enter the amount you would like to contribute and review the checkout details there.",
            ],
            [
              "03",
              "Complete checkout",
              "Paystack handles the payment and its confirmation. Then come back and keep learning.",
            ],
          ].map(([number, title, text]) => (
            <article
              key={number}
              className="border-t border-(--line) pt-6"
            >
              <span className="text-sm font-semibold text-(--green)">
                {number}
              </span>
              <h3 className="mt-4 mb-3 text-lg font-semibold">{title}</h3>
              <p className="mb-0 text-sm leading-7 text-(--muted)">
                {text}
              </p>
            </article>
          ))}
        </div>
        <p className="mt-8 max-w-2xl text-sm leading-7 text-(--muted)">
          Contributions support my tutorials and creative work. If you need a
          website, a software tool, or help fixing your code,{" "}
          <Link
            href="/hire/"
            className="font-semibold text-(--green) underline decoration-(--line) underline-offset-4"
          >
            start a project conversation
          </Link>{" "}
          so we can agree on a scope and price.
        </p>
      </section>

      <section
        className="shell pb-20 md:pb-28"
        aria-labelledby="free-support-title"
      >
        <div className="rounded-2xl border border-(--line) bg-(--surface) p-7 md:p-10">
          <div className="flex flex-col justify-between gap-7 md:flex-row md:items-center">
            <div>
              <p className="eyebrow">SUPPORT COMES IN MANY FORMS</p>
              <h2
                id="free-support-title"
                style={{ fontSize: "clamp(26px, 3vw, 36px)" }}
              >
                Being here matters, too.
              </h2>
              <p className="mb-0 max-w-xl text-sm leading-7 text-(--muted)">
                Watch a tutorial, share it with someone learning, or suggest a
                topic you would like me to explain. The lessons are here for you
                either way.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3">
              <DestinationLink
                destination="tiktok"
                className="button button-primary"
              >
                <Play size={17} aria-hidden="true" />
                Watch on TikTok
                <ArrowUpRight size={17} aria-hidden="true" />
              </DestinationLink>
              <DestinationLink
                destination="whatsapp"
                message="Hi Alexender! I have an idea for a coding tutorial: "
                className="button button-quiet"
              >
                <MessageCircle size={17} aria-hidden="true" />
                Suggest a topic
                <ArrowUpRight size={17} aria-hidden="true" />
              </DestinationLink>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
