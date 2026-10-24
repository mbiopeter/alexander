"use client";

import {
  ArrowDown,
  ArrowUpRight,
  Braces,
  Bug,
  Code2,
  Coffee,
  Database,
  Heart,
  Layers3,
  MousePointer2,
  Play,
  Sparkles,
  Terminal,
} from "lucide-react";
import Link from "next/link";

function HeroArtwork() {
  return (
    <div
      className="hero-art"
      aria-label="An illustrated coding workspace turning an idea into a finished project"
      role="img">

      <div className="art-grid" />
      <span className="art-star art-star-one" aria-hidden="true">
        ✳
      </span>
      <span className="art-star art-star-two" aria-hidden="true">
        +
      </span>
      <div className="floating-label">

        <span className="status-dot" /> A little code. A lot of possibility.

      </div>
      <div className="editor-window">

        <div className="editor-chrome">

          <div className="window-dots">

            <i />
            <i />
            <i />

          </div>
          <span>the-creative-process.tsx</span>
          <Code2 size={15} />

        </div>
        <div className="editor-body">

          <div className="editor-rail">

            <Braces size={18} />
            <Layers3 size={17} />
            <Bug size={18} />
            <span className="mt-auto">

              <Sparkles size={17} />

            </span>

          </div>
          <div className="editor-main">

            <div className="editor-tab">

              <span className="text-[#c8ee72]">TS</span> your-next-idea.tsx{" "}
              <span className="tab-dot" />

            </div>
            <div className="editor-code" aria-hidden="true">

              <div>

                <em>1</em>
                <span className="code-purple">const</span>{" "}
                <span className="code-blue">yourIdea</span> = {"{"}

              </div>
              <div>

                <em>2</em> vision:{" "}
                <span className="code-green">&quot;Something great&quot;</span>,

              </div>
              <div>

                <em>3</em> possibilities:{" "}
                <span className="code-orange">Infinity</span>,

              </div>
              <div>

                <em>4</em>
                {"}"};

              </div>
              <div className="code-space">

                <em>5</em>

              </div>
              <div>

                <em>6</em>
                <span className="code-purple">function</span>{" "}
                <span className="code-blue">makeItReal</span>() {"{"}

              </div>
              <div>

                <em>7</em> <span className="code-purple">return</span>{" "}
                <span className="code-green">&lt;Let’sBuild</span>

              </div>
              <div>

                <em>8</em> idea={"{"}
                <span className="code-blue">yourIdea</span>
                {"}"}

              </div>
              <div>

                <em>9</em> developer=
                <span className="code-orange">&quot;Alexender&quot;</span>

              </div>
              <div>

                <em>10</em> <span className="code-green">/&gt;</span>;

              </div>
              <div>

                <em>11</em>
                {"}"}
                <span className="code-cursor" />

              </div>

            </div>
            <div className="editor-terminal">

              <span>

                <Terminal size={13} /> OUTPUT

              </span>
              <p>
                <span className="terminal-check">✓</span> Ideas are only the
                beginning.
              </p>

            </div>

          </div>

        </div>
        <div className="editor-status">

          <span>

            <span className="status-dot" /> Ready to create

          </span>
          <span>TypeScript · UTF-8</span>

        </div>

      </div>
      <div className="craft-card">

        <span className="craft-icon">

          <MousePointer2 size={24} />

        </span>
        <div>

          <strong>Built with intention.</strong>
          <span>Made for real people.</span>

        </div>
        <ArrowUpRight size={22} />

      </div>
      <span className="art-caption">DESIGN. DEVELOP. MAKE IT WORK.</span>

    </div>
  );
}

export function Hero() {
  return (
    <section className="hero shell" aria-labelledby="hero-title">

      <div className="hero-copy">

        <div className="eyebrow hero-eyebrow">

          <span className="small-spark">✳</span> DEVELOPER. CREATOR. PROBLEM
          SOLVER.

        </div>
        <h1 id="hero-title">

          Good ideas
          <br />
          deserve{" "}
          <span className="highlight-word">

            great code<span className="word-dot">.</span>
            <svg
              viewBox="0 0 470 18"
              preserveAspectRatio="none"
              aria-hidden="true">

              <path d="M3 13C134 1 302 2 466 10" />

            </svg>

          </span>

        </h1>
        <p className="hero-description">
          Hey, I’m Alexender. I build thoughtful websites, Python backends, and
          practical tools for businesses and creators. Have a new idea or a
          stubborn bug? Let’s make the next step clear.
        </p>
        <div className="hero-actions">

          <Link href="/hire/" className="button button-primary">
            Hire me for your project <ArrowUpRight size={19} />
          </Link>
          <Link href="/learn/" className="button button-quiet">

            <span className="play-circle">

              <Play size={12} fill="currentColor" />

            </span>{" "}
            Learn with me
          </Link>

        </div>
        <div className="hero-footnote">

          <span className="stack-avatars" aria-hidden="true">

            <Code2 size={17} />
            <Heart size={15} />
            <Coffee size={16} />

          </span>
          <p>

            <Link href="/projects/" className="hero-project-link inline-flex items-center gap-1.5 font-semibold hover:text-[var(--green)]">
              Explore my projects <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
            <br />
            <span>Try the demos. See how they’re built.</span>

          </p>

        </div>

      </div>
      <HeroArtwork />
      <a href="#services" className="scroll-cue">

        <span>SCROLL TO EXPLORE</span>
        <ArrowDown size={16} />

      </a>

    </section>
  );
}

export function SkillsStrip() {
  return (
    <div className="skills-strip">

      <div className="shell skills-inner">

        <span className="skills-label">A FEW TOOLS IN MY KIT</span>
        <div>

          <span>

            <Braces size={17} /> React

          </span>
          <b aria-hidden="true">✳</b>
          <span className="next-word">Next.js</span>
          <b aria-hidden="true">✳</b>
          <span>

            <span className="ts-mark">TS</span> TypeScript

          </span>
          <b aria-hidden="true">✳</b>
          <span className="tailwind-word">

            <span aria-hidden="true">≈</span> Tailwind CSS

          </span>
          <b aria-hidden="true">✳</b>
          <span>

            <Database size={17} /> Python & Django

          </span>

        </div>

      </div>

    </div>
  );
}
