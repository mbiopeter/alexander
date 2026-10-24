"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Braces,
  Bug,
  Check,
  Code2,
  Copy,
  Database,
  MousePointer2,
  Play,
  RotateCcw,
  Sparkles,
  Terminal,
} from "lucide-react";
import { DestinationLink } from "@/components/destination-link";
import { Reveal } from "@/components/page-ui";
import { useToast } from "@/context/toast-context";

const lessons = [
  {
    name: "React, one hook at a time",
    tag: "REACT",
    icon: Braces,
    summary:
      "State remembers a value between renders. Updating it asks React to show the new value, without reloading the page.",
    code: '"use client";\nimport { useState } from "react";\n\nexport default function Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <button onClick={() => setCount(n => n + 1)}>\n      Clicked {count} times\n    </button>\n  );\n}',
    file: "a-little-state.tsx",
    label: "Try the button. That’s state in action.",
    setup: "Use this component inside a React or Next.js project.",
  },
  {
    name: "Make errors make sense",
    tag: "DEBUGGING",
    icon: Bug,
    summary:
      "Optional chaining stops safely when a value is missing. Trimming first also means a blank name falls back to a useful greeting.",
    code: 'export default function Greeting() {\n  const user = undefined;\n  const name = user?.name?.trim();\n  return (\n    <h1>{name || "Hello, developer"}</h1>\n  );\n}',
    file: "a-safer-greeting.jsx",
    label: "Switch the profile. The fallback has you covered.",
    setup:
      "Use this JavaScript component in a React project. Try an empty string as the name, too.",
  },
  {
    name: "Small styles. Big difference.",
    tag: "TAILWIND CSS",
    icon: Sparkles,
    summary:
      "Spacing, contrast, and a small hover effect can make a simple button easier to notice and more pleasant to use.",
    code: 'export default function ActionButton() {\n  return (\n    <button className="\n      rounded-full px-6 py-3\n      bg-lime-300 text-zinc-950\n      font-medium transition\n      hover:-translate-y-0.5\n    ">\n      Make something good ↗\n    </button>\n  );\n}',
    file: "a-better-button.tsx",
    label: "Pick a color. Make it yours.",
    setup:
      "Use in a React project with Tailwind CSS installed. Connect your own button action.",
  },
  {
    name: "Clean a little data",
    tag: "PYTHON",
    icon: Terminal,
    summary:
      "Filter out missing and blank values, then normalize the remaining strings. Small checks make a data-cleaning script easier to trust.",
    code: "def clean_names(values):\n    return [\n        value.strip().title()\n        for value in values\n        if isinstance(value, str) and value.strip()\n    ]\n\nvalues = __VALUES__\nprint(clean_names(values))",
    file: "clean_names.py",
    label: "Switch the sample input to see the expected output.",
    setup:
      "Run this snippet with Python 3. The output below is an illustration of these sample inputs.",
  },
  {
    name: "Your first JSON response",
    tag: "DJANGO",
    icon: Database,
    summary:
      "A Django view receives a request and returns a response. A URL pattern connects a path to the view; JsonResponse creates the JSON response.",
    code: '# views.py\nfrom django.http import JsonResponse\n\ndef health(request):\n    return JsonResponse({"status": "ok"})\n\n# urls.py (inside the same Django app)\nfrom django.urls import path\nfrom .views import health\n\nurlpatterns = [path("health/", health)]',
    file: "views.py + urls.py",
    label: "Reveal the example response for GET /health/.",
    setup:
      "Add these files to a Django app and include its URLs in your project. This example sends no request from this page.",
  },
];

const pythonExamples = [
  {
    input: '["  alexender  ", "", None, "  learning  "]',
    output: "['Alexender', 'Learning']",
  },
  {
    input: '["  django  ", "  python  ", "   ", None]',
    output: "['Django', 'Python']",
  },
];

const nextSteps = [
  { label: "Explore state in Focusboard", href: "/projects/focusboard/" },
  { label: "Read the debugging checklist", href: "/notes/a-useful-bug-report/" },
  { label: "Explore the interactive project designs", href: "/projects/" },
  { label: "Practise Python strings", href: "/playground/?language=python&challenge=count-vowels" },
  { label: "Explore the API simulation", href: "/projects/django-api-lab/" },
];

export function LearningPlayground() {
  const [active, setActive] = useState(0);
  const [count, setCount] = useState(0);
  const [emptyProfile, setEmptyProfile] = useState(true);
  const [swatch, setSwatch] = useState(0);
  const [pythonExample, setPythonExample] = useState(0);
  const [showDjangoResponse, setShowDjangoResponse] = useState(false);
  const [copied, setCopied] = useState(false);
  const { notify } = useToast();
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    },
    [],
  );

  const lesson = lessons[active];
  const swatchNames = ["lime", "violet", "orange"];
  const visibleCode =
    active === 2
      ? lesson.code.replace("bg-lime-300", `bg-${swatchNames[swatch]}-300`)
      : active === 1 && !emptyProfile
        ? lesson.code.replace("undefined", '{ name: "Alexender" }')
        : active === 3
          ? lesson.code.replace(
              "__VALUES__",
              pythonExamples[pythonExample].input,
            )
          : lesson.code;

  function selectLesson(index: number) {
    setActive(index);
    setCopied(false);
    if (copyTimer.current) clearTimeout(copyTimer.current);
  }

  async function copySnippet() {
    try {
      await navigator.clipboard.writeText(visibleCode);
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      notify(
        "Copy isn’t available in this browser. You can select the code and copy it manually.",
      );
    }
  }

  return (
    <section
      id="playground"
      className="learn-section"
      aria-labelledby="playground-title"
    >
      <div className="shell section">
        <Reveal className="learn-grid">
          <div className="learn-copy">
            <p className="eyebrow">GUIDED MINI LESSONS</p>
            <h2 id="playground-title">
              See the idea.
              <br />
              <span className="muted-heading">Try the code.</span>
            </h2>
            <p className="section-description">
              Five small lessons to get you moving. Pick a topic, explore the
              example, and take the code into your own project.
            </p>
            <div
              className="lesson-tabs"
              role="tablist"
              aria-label="Mini coding lessons"
              aria-orientation="vertical"
            >
              {lessons.map(({ name, icon: Icon, tag }, index) => (
                <button
                  key={tag}
                  ref={(node) => {
                    tabs.current[index] = node;
                  }}
                  type="button"
                  id={`${id}-tab-${index}`}
                  role="tab"
                  aria-selected={active === index}
                  aria-controls={`${id}-panel`}
                  tabIndex={active === index ? 0 : -1}
                  onClick={() => selectLesson(index)}
                  onKeyDown={(event) => {
                    let next = index;
                    if (event.key === "ArrowDown")
                      next = (index + 1) % lessons.length;
                    else if (event.key === "ArrowUp")
                      next = (index + lessons.length - 1) % lessons.length;
                    else if (event.key === "Home") next = 0;
                    else if (event.key === "End") next = lessons.length - 1;
                    else return;
                    event.preventDefault();
                    selectLesson(next);
                    tabs.current[next]?.focus();
                  }}
                >
                  <span className="lesson-icon">
                    <Icon size={21} aria-hidden="true" />
                  </span>
                  <span>
                    <small>{tag}</small>
                    <strong>{name}</strong>
                  </span>
                  <ArrowUpRight
                    size={19}
                    className="ml-auto"
                    aria-hidden="true"
                  />
                </button>
              ))}
            </div>
            <DestinationLink
              destination="tiktok"
              className="text-link tiktok-link"
            >
              <Play size={17} aria-hidden="true" />
              More on TikTok
              <ArrowUpRight size={17} aria-hidden="true" />
            </DestinationLink>
          </div>

          <div
            className="playground"
            role="tabpanel"
            id={`${id}-panel`}
            aria-labelledby={`${id}-tab-${active}`}
            tabIndex={0}
          >
            <div className="playground-heading">
              <span>
                <span className="status-dot" />A SMALL IDEA, EXPLAINED
              </span>
              <span>{lesson.tag}</span>
            </div>
            <div className="playground-editor">
              <div className="playground-file">
                <span>
                  <Code2 size={14} aria-hidden="true" />
                  {lesson.file}
                </span>
                <button
                  type="button"
                  className="copy-button"
                  onClick={copySnippet}
                  aria-label={copied ? "Code copied" : "Copy code snippet"}
                >
                  {copied ? (
                    <Check size={15} aria-hidden="true" />
                  ) : (
                    <Copy size={15} aria-hidden="true" />
                  )}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <pre>
                <code>{visibleCode}</code>
              </pre>
            </div>
            <div className="demo-preview">
              <span className="preview-label">
                {active >= 3 ? "EXAMPLE OUTPUT" : "LIVE PREVIEW"}
              </span>
              {active === 0 && (
                <div className="counter-demo">
                  <button
                    type="button"
                    className="demo-button"
                    onClick={() => setCount((value) => value + 1)}
                  >
                    Clicked <span aria-live="polite">{count}</span>{" "}
                    {count === 1 ? "time" : "times"}
                    <MousePointer2 size={17} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => setCount(0)}
                    aria-label="Reset counter"
                  >
                    <RotateCcw size={17} aria-hidden="true" />
                  </button>
                </div>
              )}
              {active === 1 && (
                <div className="debug-demo">
                  <strong aria-live="polite">
                    {emptyProfile ? "Hello, developer" : "Alexender"}
                    <span className="text-[var(--green)]">.</span>
                  </strong>
                  <button
                    className="demo-small-button"
                    type="button"
                    onClick={() => {
                      setEmptyProfile((value) => !value);
                      setCopied(false);
                    }}
                  >
                    {emptyProfile
                      ? "Try a named profile"
                      : "Try an empty profile"}
                    <RotateCcw size={13} aria-hidden="true" />
                  </button>
                </div>
              )}
              {active === 2 && (
                <div className="style-demo">
                  <span
                    className={`demo-button sample-button swatch-${swatch}`}
                  >
                    Make something good
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </span>
                  <div
                    className="swatches"
                    role="group"
                    aria-label="Button color"
                  >
                    {swatchNames.map((name, index) => (
                      <button
                        className={`swatch-${index}`}
                        type="button"
                        key={name}
                        onClick={() => {
                          setSwatch(index);
                          setCopied(false);
                        }}
                        aria-pressed={swatch === index}
                        aria-label={`${name} button`}
                      >
                        {swatch === index && (
                          <Check size={13} aria-hidden="true" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {active === 3 && (
                <div className="flex flex-col items-center gap-4">
                  <code
                    className="max-w-full break-words px-4 text-sm text-[var(--text)]"
                    aria-live="polite"
                  >
                    {pythonExamples[pythonExample].output}
                  </code>
                  <button
                    type="button"
                    className="demo-small-button"
                    onClick={() => {
                      setPythonExample(
                        (value) => (value + 1) % pythonExamples.length,
                      );
                      setCopied(false);
                    }}
                  >
                    Try another input
                    <RotateCcw size={13} aria-hidden="true" />
                  </button>
                </div>
              )}
              {active === 4 && (
                <div className="flex flex-col items-center gap-4">
                  <code
                    className="text-sm text-[var(--text)]"
                    aria-live="polite"
                  >
                    {showDjangoResponse
                      ? '200 OK → {"status": "ok"}'
                      : "GET /health/"}
                  </code>
                  <button
                    type="button"
                    className="demo-small-button"
                    onClick={() => setShowDjangoResponse((value) => !value)}
                  >
                    {showDjangoResponse
                      ? "Show the request"
                      : "Show example response"}
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </button>
                </div>
              )}
              <p>{lesson.label}</p>
            </div>
            <div className="lesson-summary">
              <p className="mb-3">{lesson.summary}</p>
              <p className="mb-0 text-[var(--muted)]">{lesson.setup}</p>
              <Link href={nextSteps[active].href} className="text-link mt-5 min-h-11">{nextSteps[active].label}<ArrowUpRight size={17} /></Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
