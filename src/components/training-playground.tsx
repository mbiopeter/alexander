"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Bookmark,
  BookOpen,
  Check,
  CheckCheck,
  ChevronRight,
  Code2,
  Copy,
  Download,
  FileCode2,
  FolderOpen,
  Lightbulb,
  LoaderCircle,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Terminal,
  Trash2,
  Trophy,
  ListChecks,
  Undo2,
  Upload,
  X,
} from "lucide-react";
import {
  CHALLENGES,
  LANGUAGES,
  getChallenge,
  getLanguage,
  pickPracticeChallenges,
  type LanguageId,
} from "@/lib/challenges";
import {
  answerKey,
  collectAnswer,
  isDraftWithinLimit,
  MAX_BACKUP_BYTES,
  parsePracticeBackup,
  restorePractice,
  selectionFromSearch,
  serializePracticeBackup,
  useProgress,
  type CollectedAnswer,
  type PracticeBackup,
  type RestoreMode,
} from "@/lib/progress";
import { useTheme } from "@/context/theme-context";
import type { RunReport, TestResult } from "@/lib/runner";
import { TheoryQuiz } from "@/components/theory-quiz";

const CodeEditor = dynamic(() => import("./code-editor"), {
  ssr: false,
  loading: () => (
    <div
      role="status"
      className="grid h-[480px] place-items-center rounded-2xl border border-[var(--pg-border)] bg-[var(--pg-panel)] text-sm text-[var(--pg-muted)]"
    >
      Preparing your workspace…
    </div>
  ),
});

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");
const languageBadges: Record<LanguageId, { badge: string; color: string }> = {
  python: { badge: "Py", color: "bg-[#fff2cf] text-[#916521]" },
  javascript: { badge: "JS", color: "bg-[#fff4b8] text-[#6d5710]" },
  java: { badge: "Ja", color: "bg-[#ffeadf] text-[#b14926]" },
  c: { badge: "C", color: "bg-[#e2edff] text-[#345f9c]" },
  cpp: { badge: "C++", color: "bg-[#ebe5ff] text-[#7050b0]" },
};

type RunView =
  | { phase: "idle" }
  | { phase: "running" }
  | { phase: "done"; report: RunReport }
  | { phase: "error"; message: string };
type Connection = "checking" | "configured" | "unavailable" | "unknown";
const smallButton =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 text-xs font-medium text-[var(--pg-muted)] transition-colors hover:bg-[var(--pg-soft)] hover:text-[var(--pg-fg)] disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none";
const panel =
  "rounded-2xl border border-[var(--pg-border)] bg-[var(--pg-panel)]";

function isRunReport(value: unknown): value is RunReport {
  if (!value || typeof value !== "object") return false;
  const report = value as Partial<RunReport>;
  return (
    (report.verdict === "correct" || report.verdict === "incorrect") &&
    Number.isInteger(report.passed) &&
    Number.isInteger(report.total) &&
    typeof report.completedAt === "string" &&
    Array.isArray(report.tests) &&
    report.tests.length === report.total &&
    report.tests.every(
      (test) =>
        test &&
        typeof test.id === "string" &&
        typeof test.actual === "string" &&
        typeof test.expected === "string" &&
        typeof test.stderr === "string" &&
        typeof test.passed === "boolean",
    )
  );
}

function visibleOutput(value: string) {
  return value === "" ? "(no output)" : value;
}

export default function TrainingPlayground({
  isNotFound = true,
}: {
  isNotFound?: boolean;
}) {
  const { resolvedTheme, mounted: themeReady } = useTheme();
  const { progress, setProgress, ready, storageNote } = useProgress();
  const [section, setSection] = useState<"theory" | "practice">("practice");
  const [practiceChallengeIds, setPracticeChallengeIds] = useState<string[]>([]);
  const [run, setRun] = useState<RunView>({ phase: "idle" });
  const [connection, setConnection] = useState<Connection>("checking");
  const [showSolution, setShowSolution] = useState(false);
  const [motionPaused, setMotionPaused] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [selectedResult, setSelectedResult] = useState(0);
  const [focusMode, setFocusMode] = useState(false);
  const [connectionCheck, setConnectionCheck] = useState(0);
  const [undo, setUndo] = useState<{ key: string; code: string; message: string } | null>(null);
  const [pendingBackup, setPendingBackup] = useState<{ name: string; backup: PracticeBackup } | null>(null);
  const [restoreMode, setRestoreMode] = useState<RestoreMode>("merge");
  const [replaceConfirmed, setReplaceConfirmed] = useState(false);
  const [backupError, setBackupError] = useState<string | null>(null);
  const [readingBackup, setReadingBackup] = useState(false);
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const importPanelRef = useRef<HTMLElement | null>(null);
  const linkApplied = useRef(false);
  const practiceSessionInitialized = useRef(false);
  const runRef = useRef<{ controller: AbortController; key: string } | null>(
    null,
  );
  const workbenchRef = useRef<HTMLDivElement | null>(null);
  const collectionRef = useRef<HTMLElement | null>(null);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sessionChallenges = practiceChallengeIds.length
    ? practiceChallengeIds
        .map((id) => getChallenge(id))
        .filter((item): item is (typeof CHALLENGES)[number] => Boolean(item))
    : CHALLENGES.slice(0, 10);
  const progressChallenge = getChallenge(progress.challengeId);
  const challenge =
    progressChallenge &&
    (!practiceChallengeIds.length || practiceChallengeIds.includes(progressChallenge.id))
      ? progressChallenge
      : sessionChallenges[0] ?? CHALLENGES[0];
  const language = getLanguage(progress.language)!;
  const key = answerKey(language.id, challenge.id);
  const code = progress.drafts[key] ?? challenge.starter[language.id];
  const currentCode = useRef(code);
  currentCode.current = code;
  const isRunning = run.phase === "running";
  const solvedInLanguage = progress.answers.filter(
    (answer) =>
      answer.language === language.id &&
      sessionChallenges.some((item) => item.id === answer.challengeId),
  ).length;
  const totalPairs = CHALLENGES.length * LANGUAGES.length;
  const practiceScore = Math.round((solvedInLanguage / Math.max(1, sessionChallenges.length)) * 100);
  const motionState = motionPaused
    ? "[animation-play-state:paused]"
    : "[animation-play-state:running]";
  const canRun =
    ready &&
    !isRunning &&
    connection !== "checking" &&
    connection !== "unavailable";

  useEffect(() => {
    if (!ready) return;
    const applyLink = () => {
      const selection = selectionFromSearch(window.location.search);
      if (Object.keys(selection).length) {
        runRef.current?.controller.abort();
        runRef.current = null;
        setRun({ phase: "idle" });
        setShowSolution(false);
        setUndo(null);
        setProgress((current) => ({ ...current, ...selection }));
      }
    };
    if (!linkApplied.current) {
      linkApplied.current = true;
      applyLink();
    }
    window.addEventListener("popstate", applyLink);
    return () => window.removeEventListener("popstate", applyLink);
  }, [ready, setProgress]);

  useEffect(() => {
    if (!ready || practiceSessionInitialized.current) return;
    practiceSessionInitialized.current = true;

    const linked = selectionFromSearch(window.location.search).challengeId;
    const preferredId = linked ?? progress.challengeId;
    const selected = pickPracticeChallenges(10, preferredId);
    const targetId = selected.some((item) => item.id === preferredId)
      ? preferredId
      : selected[0]?.id;

    setPracticeChallengeIds(selected.map((item) => item.id));
    if (targetId && targetId !== progress.challengeId) {
      setProgress((current) => ({ ...current, challengeId: targetId }));
    }
  }, [ready, progress.challengeId, setProgress]);

  useEffect(() => {
    if (focusMode) document.body.dataset.practiceFocus = "true";
    else delete document.body.dataset.practiceFocus;
    return () => { delete document.body.dataset.practiceFocus; };
  }, [focusMode]);

  useEffect(() => {
    setConnection("checking");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8_000);
    fetch(`${basePath}/api/playground/run/`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unavailable");
        const state: unknown = await response.json();
        if (controller.signal.aborted) return;
        setConnection(
          Boolean(
            state &&
            typeof state === "object" &&
            "configured" in state &&
            state.configured,
          )
            ? "configured"
            : "unavailable",
        );
      })
      .catch(() => {
        if (!controller.signal.aborted) setConnection("unknown");
      })
      .finally(() => window.clearTimeout(timeout));
    const fallback = window.setTimeout(
      () =>
        setConnection((state) => (state === "checking" ? "unknown" : state)),
      8_100,
    );
    return () => {
      controller.abort();
      window.clearTimeout(timeout);
      window.clearTimeout(fallback);
    };
  }, [connectionCheck]);

  useEffect(
    () => () => {
      runRef.current?.controller.abort();
      if (noticeTimer.current) clearTimeout(noticeTimer.current);
    },
    [],
  );

  function announce(message: string) {
    setNotice(message);
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(null), 4_000);
  }

  function cancelRun() {
    runRef.current?.controller.abort();
    runRef.current = null;
    setRun({ phase: "idle" });
  }

  function syncSelectionUrl(challengeId: string, languageId: LanguageId) {
    if (isNotFound) return;
    const url = new URL(window.location.href);
    url.searchParams.set("language", languageId);
    url.searchParams.set("challenge", challengeId);
    window.history.replaceState(window.history.state, "", url);
  }

  function choose(challengeId: string, languageId: LanguageId = language.id) {
    if (!getChallenge(challengeId) || !getLanguage(languageId)) return;
    cancelRun();
    setShowSolution(false);
    setUndo(null);
    setSelectedResult(0);
    setProgress((current) => ({
      ...current,
      challengeId,
      language: languageId,
    }));
    syncSelectionUrl(challengeId, languageId);
  }

  function newPracticeTest() {
    const selected = pickPracticeChallenges(10);
    setPracticeChallengeIds(selected.map((item) => item.id));
    if (selected[0]) choose(selected[0].id);
    announce("New practice test ready: 10 mixed-difficulty coding questions.");
  }

  const changeCode = useCallback(
    (value: string) => {
      if (!isDraftWithinLimit(value)) {
        announce("That edit exceeds the 32,768-character draft limit. Your previous draft is unchanged; shorten the pasted code and try again.");
        return false;
      }
      if (value === currentCode.current) return true;
      setUndo(null);
      setProgress((current) => ({
        ...current,
        drafts: { ...current.drafts, [key]: value },
      }));
      setRun((current) =>
        current.phase === "running" ? current : { phase: "idle" },
      );
      return true;
    },
    [key, setProgress],
  );

  function replaceCode(value: string, message: string) {
    if (value === code) {
      announce("Your editor already contains that code.");
      return;
    }
    const previous = code;
    changeCode(value);
    setUndo({ key, code: previous, message });
  }

  function undoReplacement() {
    if (!undo || undo.key !== key || isRunning) return;
    changeCode(undo.code);
    setUndo(null);
    announce("Your previous draft has been restored.");
  }

  async function runTests() {
    if (!canRun || runRef.current) return;
    if (!code.trim()) {
      setRun({
        phase: "error",
        message: "Write a little code first, then run the tests.",
      });
      return;
    }
    if (new TextEncoder().encode(code).length > 32_768) {
      setRun({
        phase: "error",
        message:
          "This playground accepts programs up to 32 KB. Shorten your program and try again.",
      });
      return;
    }
    const controller = new AbortController();
    const active = { controller, key };
    runRef.current = active;
    setRun({ phase: "running" });
    setSelectedResult(0);
    let timedOut = false;
    const timer = window.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 55_000);
    try {
      const response = await fetch(`${basePath}/api/playground/run/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          language: language.id,
          challengeId: challenge.id,
          sourceCode: code,
        }),
      });
      const body: unknown = await response.json();
      if (runRef.current !== active) return;
      if (!response.ok) {
        const error =
          body && typeof body === "object" && "error" in body
            ? body.error
            : null;
        const message =
          error &&
          typeof error === "object" &&
          "message" in error &&
          typeof error.message === "string"
            ? error.message
            : "The runner could not finish this attempt. Your code is safe; please try again.";
        if (
          error &&
          typeof error === "object" &&
          "code" in error &&
          error.code === "not_configured"
        )
          setConnection("unavailable");
        throw new Error(message);
      }
      if (!isRunReport(body))
        throw new Error(
          "The runner returned an incomplete result. Please try again.",
        );
      setConnection("configured");
      setRun({ phase: "done", report: body });
      if (
        body.verdict === "correct" &&
        body.passed === challenge.tests.length &&
        body.tests.every((test) => test.passed)
      ) {
        setProgress((current) =>
          collectAnswer(current, {
            language: language.id,
            challengeId: challenge.id,
            sourceCode: code,
            savedAt: body.completedAt,
            passed: body.passed,
            total: body.total,
            guided: current.revealed.includes(key),
          }),
        );
        announce("Correct answer added to your collection.");
      }
    } catch (error) {
      if (runRef.current !== active) return;
      if (controller.signal.aborted && !timedOut) return;
      setRun({
        phase: "error",
        message: timedOut
          ? "This run took too long to return. Your code is saved; please try again."
          : error instanceof Error
            ? error.message
            : "The runner is unavailable. Please try again.",
      });
    } finally {
      window.clearTimeout(timer);
      if (runRef.current === active) runRef.current = null;
    }
  }

  function revealSolution() {
    setShowSolution((open) => !open);
    if (!showSolution)
      setProgress((current) => ({
        ...current,
        revealed: current.revealed.includes(key)
          ? current.revealed
          : [...current.revealed, key],
      }));
  }

  async function copy(value: string, message: string) {
    try {
      await navigator.clipboard.writeText(value);
      announce(message);
    } catch {
      announce(
        "Clipboard access is unavailable. Select the code and copy it manually.",
      );
    }
  }

  function openAnswer(answer: CollectedAnswer) {
    const targetKey = answerKey(answer.language, answer.challengeId);
    const previous = progress.drafts[targetKey] ?? getChallenge(answer.challengeId)!.starter[answer.language];
    choose(answer.challengeId, answer.language);
    setProgress((current) => ({
      ...current,
      drafts: {
        ...current.drafts,
        [answerKey(answer.language, answer.challengeId)]: answer.sourceCode,
      },
    }));
    if (previous !== answer.sourceCode) setUndo({ key: targetKey, code: previous, message: "Saved answer opened." });
    workbenchRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
    announce("Saved answer opened in the editor.");
  }

  function downloadAnswers() {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            version: 1,
            exportedAt: new Date().toISOString(),
            answers: progress.answers,
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "mbiopeter-playground-answers.json";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
  }

  function downloadPractice() {
    try {
      const raw = serializePracticeBackup(progress);
      const url = URL.createObjectURL(new Blob([raw], { type: "application/json" }));
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "mbiopeter-practice-backup.json";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
      announce("Practice backup downloaded, including your unfinished drafts.");
    } catch (error) {
      setBackupError(error instanceof Error ? error.message : "This backup could not be created. Your local work is unchanged.");
    }
  }

  async function readBackup(file: File | undefined) {
    if (!file) return;
    setBackupError(null);
    setPendingBackup(null);
    setReadingBackup(true);
    try {
      if (file.size > MAX_BACKUP_BYTES) throw new Error("Choose a practice backup smaller than 8 MB.");
      const backup = parsePracticeBackup(await file.text());
      setRestoreMode("merge");
      setReplaceConfirmed(false);
      setPendingBackup({ name: file.name, backup });
      requestAnimationFrame(() => importPanelRef.current?.focus());
    } catch (error) {
      setBackupError(error instanceof Error ? error.message : "This file could not be read. Your local work is unchanged.");
    } finally {
      setReadingBackup(false);
      if (importInputRef.current) importInputRef.current.value = "";
    }
  }

  function confirmRestore() {
    if (!pendingBackup || isRunning || (restoreMode === "replace" && !replaceConfirmed)) return;
    cancelRun();
    setShowSolution(false);
    setUndo(null);
    setSelectedResult(0);
    const incoming = pendingBackup.backup.progress;
    setProgress((current) => restorePractice(current, incoming, restoreMode));
    if (restoreMode === "replace") syncSelectionUrl(incoming.challengeId, incoming.language);
    setPendingBackup(null);
    setReplaceConfirmed(false);
    announce(restoreMode === "merge" ? "Backup merged. Your existing drafts and answers were kept where they overlap." : "Practice restored from your selected backup.");
  }

  const report = run.phase === "done" ? run.report : null;
  const result = report?.tests[selectedResult];

  return (
    <main
      id="main"
      data-detour-theme={themeReady ? resolvedTheme : "auto"}
      data-focus-mode={focusMode ? "true" : undefined}
      className="detour-playground min-h-dvh bg-[var(--pg-bg)] pb-12 font-sans text-[var(--pg-fg)] antialiased"
    >
      <div className="shell">
        <nav
          aria-label="Playground navigation"
          className="practice-navigation flex flex-wrap items-center justify-between gap-2 border-b border-[var(--pg-border)] py-3"
        >
          <div className="flex flex-wrap items-center gap-1">
            <Link href="/" className={smallButton}>
              <ArrowLeft size={14} aria-hidden="true" /> Back home
            </Link>
            {isNotFound && (
              <button
                type="button"
                className={smallButton}
                onClick={() => {
                  if (window.history.length > 1) window.history.back();
                  else window.location.assign("/");
                }}
              >
                Go back
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-1">
            <Link href="/learn/" className={`${smallButton} practice-more-lessons`}>
              More ways to learn <ArrowUpRight size={13} aria-hidden="true" />
            </Link>
            <button
              type="button"
              aria-pressed={focusMode}
              className={`${smallButton} border border-[var(--pg-border)] bg-[var(--pg-panel)]`}
              onClick={() => {
                setFocusMode((current) => !current);
                if (!focusMode) requestAnimationFrame(() => workbenchRef.current?.scrollIntoView({ behavior: "auto", block: "start" }));
              }}
            >
              {focusMode ? <Minimize2 size={14} aria-hidden="true" /> : <Maximize2 size={14} aria-hidden="true" />}
              {focusMode ? "Exit focus mode" : "Focus on coding"}
            </button>
          </div>
        </nav>

        <div className="mt-5 flex flex-wrap items-center gap-2 rounded-2xl border border-[var(--pg-border)] bg-[var(--pg-panel)] p-2" role="tablist" aria-label="Playground section">
          <button
            type="button"
            role="tab"
            aria-selected={section === "theory"}
            onClick={() => { setSection("theory"); setFocusMode(false); cancelRun(); }}
            className={`inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors ${section === "theory" ? "bg-[var(--pg-accent)] text-[var(--pg-accent-ink)]" : "text-[var(--pg-muted)] hover:bg-[var(--pg-soft)]"}`}
          >
            <BookOpen size={16} aria-hidden="true" /> Theory
            <span className="rounded-full bg-black/10 px-2 py-0.5 text-[10px]">100 questions</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={section === "practice"}
            onClick={() => setSection("practice")}
            className={`inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors ${section === "practice" ? "bg-[var(--pg-accent)] text-[var(--pg-accent-ink)]" : "text-[var(--pg-muted)] hover:bg-[var(--pg-soft)]"}`}
          >
            <ListChecks size={16} aria-hidden="true" /> Practice
            <span className="rounded-full bg-black/10 px-2 py-0.5 text-[10px]">{CHALLENGES.length} questions</span>
          </button>
        </div>

        {section === "theory" ? (
          <TheoryQuiz />
        ) : (
          <>
        <section
          aria-labelledby="playground-title"
          className="practice-intro grid items-center gap-6 py-7 md:grid-cols-[1fr_auto] md:py-10"
        >
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.14em]">
              <span className="rounded-full bg-[var(--pg-accent-soft)] px-2.5 py-1 text-[var(--pg-accent)]">
                {isNotFound ? "404 / Page not found" : "The coding playground"}
              </span>
              <span className="text-[var(--pg-muted)]">
                {isNotFound
                  ? "A little lost. A little curious."
                  : "Stay curious. Keep building."}
              </span>
            </div>
            <h1
              id="playground-title"
              className="text-balance text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-4xl lg:text-[42px]"
            >
              {isNotFound ? "Make this detour " : "A little practice. "}
              <span className="text-[var(--pg-accent)]">{isNotFound ? "count." : "Real progress."}</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--pg-muted)]">
              {isNotFound
                ? "That page is out of reach, but a new skill isn’t. "
                : "A small space for your next coding win. "}
              Pick a language, try a challenge, and collect your wins.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[var(--pg-muted)]">
              <span className="flex items-center gap-1.5">
                <FileCode2 size={14} aria-hidden="true" /> {sessionChallenges.length} random questions from {CHALLENGES.length}
              </span>
              <span className="flex items-center gap-1.5">
                <Code2 size={14} aria-hidden="true" /> {LANGUAGES.length}{" "}
                languages
              </span>
              <button
                type="button"
                onClick={() =>
                  collectionRef.current?.scrollIntoView({ behavior: "auto" })
                }
                className="flex min-h-9 items-center gap-1.5 rounded-md font-medium text-[var(--pg-accent)]"
              >
                <Bookmark size={14} aria-hidden="true" />{" "}
                {progress.answers.length} collected{" "}
                <ArrowUpRight size={13} aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="relative hidden w-64 md:block">
            <div
              aria-hidden="true"
              className="relative flex h-36 items-center justify-center gap-2 select-none"
            >
              {isNotFound && <span className="text-[98px] font-semibold tracking-tighter text-[var(--pg-border)]">4</span>}
              <div className="relative h-20 w-20 shrink-0">
                <div
                  className={`absolute top-0 h-6 w-full animate-bounce [animation-duration:6s] motion-reduce:animate-none ${motionState}`}
                >
                  <div className="relative h-20 w-20 rounded-full border border-[#a3cabd] bg-[radial-gradient(circle_at_30%_25%,#e0ffe8,#9ecbb5_32%,#457c69_65%,#284a42)] shadow-[inset_-8px_-6px_15px_#0c2a3840]">
                    <div
                      className={`absolute -inset-4 animate-spin rounded-full border border-[var(--pg-border)] [animation-duration:24s] motion-reduce:animate-none ${motionState}`}
                    >
                      <span className="absolute -top-1 left-1/2 h-2 w-2 rounded-full bg-[var(--pg-accent)]" />
                    </div>
                    <div className="absolute -left-[25%] top-[30%] h-[38%] w-[150%] -rotate-[25deg] rounded-[50%] border-[4px] border-[#b9e4bd] border-t-[#b9e4bd40]" />
                  </div>
                </div>
              </div>
              {isNotFound && <span className="text-[98px] font-semibold tracking-tighter text-[var(--pg-border)]">4</span>}
              <Sparkles className="absolute right-4 top-1 h-4 w-4 text-[var(--pg-accent)]" />
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-[var(--pg-border)] bg-[var(--pg-panel)] px-3 py-1 font-mono text-[9px] tracking-wider text-[var(--pg-muted)]">
                {isNotFound ? "YOU’RE IN A GOOD PLACE" : "SMALL STEPS. KEEP BUILDING."}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setMotionPaused((paused) => !paused)}
              className="absolute -right-2 -top-3 grid h-8 w-8 place-items-center rounded-full text-[var(--pg-muted)] hover:bg-[var(--pg-soft)] motion-reduce:hidden"
              aria-label={
                motionPaused
                  ? "Resume illustration animation"
                  : "Pause illustration animation"
              }
            >
              {motionPaused ? <Play size={12} /> : <Pause size={12} />}
            </button>
          </div>
        </section>

        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div
            className="flex flex-wrap items-center gap-2"
            aria-label="Programming language"
          >
            {LANGUAGES.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={language.id === option.id}
                disabled={!ready}
                onClick={() => choose(challenge.id, option.id)}
                className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-3 text-xs font-medium transition-colors disabled:opacity-50 motion-reduce:transition-none ${language.id === option.id ? "border-[var(--pg-accent)] bg-[var(--pg-panel)] text-[var(--pg-fg)] shadow-sm" : "border-transparent text-[var(--pg-muted)] hover:bg-[var(--pg-soft)]"}`}
              >
                <span
                  className={`grid h-6 min-w-6 place-items-center rounded-md px-1 font-mono text-[10px] font-bold ${languageBadges[option.id].color}`}
                >
                  {languageBadges[option.id].badge}
                </span>
                {option.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-[var(--pg-muted)]">
            <span
              className={`h-1.5 w-1.5 rounded-full ${connection === "configured" ? "bg-[var(--pg-success)]" : "bg-[var(--pg-warning)]"}`}
            />
            {connection === "checking"
              ? "Checking runner…"
              : connection === "configured"
                ? "Free runner ready"
                : connection === "unavailable"
                  ? "Runner temporarily unavailable"
                  : "Runner status unavailable"}
            {connection !== "configured" && (
              <button type="button" disabled={connection === "checking"} onClick={() => setConnectionCheck((attempt) => attempt + 1)} className={`${smallButton} px-2`}>
                <RotateCcw size={12} aria-hidden="true" /> Check connection
              </button>
            )}
            <span className="rounded-lg bg-[var(--pg-accent-soft)] px-2.5 py-1.5 font-semibold text-[var(--pg-accent)]">
              Score {solvedInLanguage}/{sessionChallenges.length} · {practiceScore}%
            </span>
            <button type="button" onClick={newPracticeTest} disabled={!ready || isRunning} className={`${smallButton} border border-[var(--pg-border)] bg-[var(--pg-panel)]`}>
              <RotateCcw size={12} aria-hidden="true" /> New random 10
            </button>
          </div>
        </div>

        {storageNote && (
          <p
            role="status"
            className="mb-4 rounded-xl bg-[var(--pg-warning-bg)] px-4 py-3 text-xs leading-5 text-[var(--pg-warning)]"
          >
            {storageNote}
          </p>
        )}
        {connection === "unavailable" && (
          <p
            role="status"
            className="mb-4 rounded-xl border border-[var(--pg-border)] bg-[var(--pg-panel)] px-4 py-3 text-xs leading-5 text-[var(--pg-muted)]"
          >
            <span className="font-semibold text-[var(--pg-fg)]">
              Practice space is ready.
            </span>{" "}
            The free public code runner is temporarily unavailable. You can still write code,
            explore hints, and read reference solutions. Your drafts stay in this browser;
            try the runner again shortly.
          </p>
        )}

        <div className={`practice-mobile-selector ${panel} mb-4 p-4`}>
          <label htmlFor="practice-challenge" className="mb-2 block text-xs font-semibold">Choose a challenge</label>
          <select
            id="practice-challenge"
            value={challenge.id}
            disabled={!ready}
            onChange={(event) => choose(event.target.value)}
            className="min-h-11 w-full rounded-lg border border-[var(--pg-border)] bg-[var(--pg-soft)] px-3 py-2 text-sm text-[var(--pg-fg)]"
          >
            {sessionChallenges.map((item, index) => (
              <option key={item.id} value={item.id}>
                {String(index + 1).padStart(2, "0")} · {item.title}{progress.answers.some((answer) => answer.language === language.id && answer.challengeId === item.id) ? " · Completed" : ""}
              </option>
            ))}
          </select>
          <p className="mb-0 mt-2 text-xs text-[var(--pg-muted)]">{language.label} test score · {solvedInLanguage}/{sessionChallenges.length} solved · {practiceScore}%</p>
        </div>

        <div
          ref={workbenchRef}
          className="practice-workbench grid scroll-mt-28 items-start gap-5 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)]"
        >
          <aside
            aria-labelledby="challenge-list-title"
            className={`practice-challenge-sidebar ${panel} overflow-hidden lg:sticky lg:top-28`}
          >
            <div className="border-b border-[var(--pg-border)] px-5 py-4">
              <div className="flex items-center justify-between">
                <h2
                  id="challenge-list-title"
                  className="text-sm font-semibold tracking-normal"
                >
                  Your next challenge
                </h2>
                <FolderOpen
                  size={16}
                  className="text-[var(--pg-muted)]"
                  aria-hidden="true"
                />
              </div>
              <p className="mt-1.5 text-xs text-[var(--pg-muted)]">
                Small steps. Real progress.
              </p>
            </div>
            <ol className="grid gap-1 p-2 sm:grid-cols-2 lg:grid-cols-1">
              {sessionChallenges.map((item, index) => {
                const solved = progress.answers.some(
                  (answer) =>
                    answer.language === language.id &&
                    answer.challengeId === item.id,
                );
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      disabled={!ready}
                      onClick={() => choose(item.id)}
                      aria-current={
                        challenge.id === item.id ? "step" : undefined
                      }
                      className={`flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors disabled:opacity-50 motion-reduce:transition-none ${challenge.id === item.id ? "bg-[var(--pg-accent-soft)]" : "hover:bg-[var(--pg-soft)]"}`}
                    >
                      <span
                        className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-medium ${solved ? "bg-[var(--pg-success-bg)] text-[var(--pg-success)]" : challenge.id === item.id ? "bg-[var(--pg-accent)] text-[var(--pg-accent-ink)]" : "bg-[var(--pg-soft)] text-[var(--pg-muted)]"}`}
                      >
                        {solved ? (
                          <Check size={12} aria-label="Completed" />
                        ) : (
                          String(index + 1).padStart(2, "0")
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-medium leading-5">
                          {item.title}
                        </span>
                        <span className="mt-1 block text-[10px] text-[var(--pg-muted)]">
                          {item.difficulty} ·{" "}
                          {solved
                            ? "Collected"
                            : `${item.tests.length} test cases`}
                        </span>
                      </span>
                      {challenge.id === item.id && (
                        <ChevronRight
                          size={13}
                          className="mt-1 shrink-0 text-[var(--pg-accent)]"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ol>
            <div className="border-t border-[var(--pg-border)] p-5">
              <div className="mb-2 flex items-center justify-between text-[10px] text-[var(--pg-muted)]">
                <span>{language.label} progress</span>
                <span>
                  {solvedInLanguage}/{sessionChallenges.length}
                </span>
              </div>
              <progress
                className="block h-1.5 w-full overflow-hidden rounded-full [&::-webkit-progress-bar]:bg-[var(--pg-soft)] [&::-webkit-progress-value]:bg-[var(--pg-accent)] [&::-moz-progress-bar]:bg-[var(--pg-accent)]"
                value={solvedInLanguage}
                max={sessionChallenges.length}
                aria-label={`${language.label} completed challenges`}
              />
              <p className="mt-3 text-[11px] leading-5 text-[var(--pg-muted)]">
                Every correct solution is a little win worth keeping.
              </p>
            </div>
          </aside>

          <div className="min-w-0 space-y-4">
            <section
              aria-labelledby="active-challenge-title"
              className={`${panel} p-5 sm:p-6`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-widest text-[var(--pg-muted)]">
                    <span>
                      Challenge{" "}
                      {String(
                        sessionChallenges.findIndex(
                          (item) => item.id === challenge.id,
                        ) + 1,
                      ).padStart(2, "0")}
                    </span>
                    <span className="rounded bg-[var(--pg-success-bg)] px-1.5 py-0.5 text-[var(--pg-success)]">
                      {challenge.difficulty}
                    </span>
                  </div>
                  <h2
                    id="active-challenge-title"
                    className="text-lg font-semibold tracking-tight sm:text-xl"
                  >
                    {challenge.title}
                  </h2>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--pg-soft)] px-2.5 py-1.5 font-mono text-[10px] text-[var(--pg-muted)]">
                  <Terminal size={11} aria-hidden="true" /> stdin → stdout
                </span>
              </div>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--pg-muted)]">
                {challenge.prompt}
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Example
                  label="Sample input"
                  value={challenge.tests[0].input}
                />
                <Example
                  label="Expected output"
                  value={challenge.tests[0].expected}
                />
              </div>
              <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
                <details
                  key={`${key}:format`}
                  className="max-w-xl text-xs text-[var(--pg-muted)]"
                >
                  <summary className="cursor-pointer rounded py-2 font-medium">
                    Input, output & constraints
                  </summary>
                  <div className="space-y-2 pb-2 leading-5">
                    <p>
                      <strong>Input:</strong> {challenge.inputFormat}
                    </p>
                    <p>
                      <strong>Output:</strong> {challenge.outputFormat}
                    </p>
                    <ul className="list-disc space-y-1 pl-4">
                      {challenge.constraints.map((constraint) => (
                        <li key={constraint}>{constraint}</li>
                      ))}
                    </ul>
                  </div>
                </details>
                <details
                  key={`${key}:hints`}
                  className="max-w-sm text-xs text-[var(--pg-muted)]"
                >
                  <summary className="cursor-pointer rounded py-2 font-medium text-[var(--pg-accent)]">
                    <Lightbulb
                      size={13}
                      className="mr-1.5 inline"
                      aria-hidden="true"
                    />
                    Need a hint?
                  </summary>
                  <ol className="list-decimal space-y-2 py-2 pl-4 leading-5">
                    {challenge.hints.map((hint) => (
                      <li key={hint}>{hint}</li>
                    ))}
                  </ol>
                </details>
              </div>
            </section>

            <CodeEditor
              value={code}
              onChange={changeCode}
              language={language.id}
              filename={language.filename}
              theme={resolvedTheme ?? "light"}
              documentId={key}
              onRun={runTests}
              disabled={isRunning || !ready}
              editorBasePath={`${basePath}/monaco/vs`}
            />

            <div className="flex flex-wrap items-center justify-between gap-3 px-1">
              <div className="flex flex-wrap items-center gap-1">
                <button
                  type="button"
                  disabled={isRunning || !ready}
                  onClick={() => replaceCode(challenge.starter[language.id], "Starter code restored.")}
                  className={smallButton}
                >
                  <RotateCcw size={13} aria-hidden="true" />
                  Reset code
                </button>
                <button
                  type="button"
                  aria-expanded={showSolution}
                  disabled={!ready}
                  onClick={revealSolution}
                  className={smallButton}
                >
                  <Lightbulb size={13} aria-hidden="true" />
                  {showSolution ? "Hide solution" : "View solution"}
                </button>
              </div>
              <div className="flex items-center gap-2">
                {isRunning && (
                  <button
                    type="button"
                    onClick={cancelRun}
                    className={smallButton}
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="button"
                  onClick={runTests}
                  disabled={!canRun}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--pg-accent)] px-5 text-xs font-semibold text-[var(--pg-accent-ink)] shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
                >
                  {isRunning ? (
                    <LoaderCircle
                      size={14}
                      className="animate-spin motion-reduce:animate-none"
                      aria-hidden="true"
                    />
                  ) : (
                    <Play size={14} fill="currentColor" aria-hidden="true" />
                  )}
                  {isRunning ? "Running tests…" : "Run tests"}
                  <kbd className="ml-2 hidden rounded border border-current/25 px-1.5 py-0.5 text-[9px] font-normal opacity-80 sm:inline">
                    Ctrl ↵
                  </kbd>
                </button>
              </div>
            </div>

            {undo?.key === key && (
              <div role="status" className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--pg-border)] bg-[var(--pg-accent-soft)] px-4 py-2 text-xs">
                <span>{undo.message} Your previous draft is available until your next edit.</span>
                <button type="button" onClick={undoReplacement} disabled={isRunning} className={smallButton}>
                  <Undo2 size={14} aria-hidden="true" /> Undo replacement
                </button>
              </div>
            )}

            {showSolution && (
              <section
                className={`${panel} overflow-hidden`}
                aria-labelledby="reference-title"
              >
                <div className="flex items-center justify-between gap-3 border-b border-[var(--pg-border)] px-5 py-3">
                  <h3 id="reference-title" className="text-sm font-semibold">
                    Reference solution · {language.label}
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      copy(
                        challenge.solution[language.id],
                        "Reference solution copied.",
                      )
                    }
                    className={smallButton}
                  >
                    <Copy size={13} aria-hidden="true" />
                    Copy
                  </button>
                </div>
                <p className="px-5 pt-4 text-xs leading-6 text-[var(--pg-muted)]">
                  {challenge.explanation}
                </p>
                <pre
                  tabIndex={0}
                  className="m-4 max-h-80 overflow-auto rounded-xl bg-[var(--pg-soft)] p-4 text-xs leading-6"
                >
                  <code>{challenge.solution[language.id]}</code>
                </pre>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--pg-border)] px-5 py-3">
                  <p className="text-[11px] leading-5 text-[var(--pg-muted)]">
                    Viewing a solution doesn’t complete the challenge. A passing
                    run will be labeled “Guided”.
                  </p>
                  <button
                    type="button"
                    disabled={isRunning}
                    onClick={() => {
                      replaceCode(challenge.solution[language.id], "Reference solution loaded. Run the tests to check it.");
                    }}
                    className={smallButton}
                  >
                    <Code2 size={13} aria-hidden="true" />
                    Use in editor
                  </button>
                </div>
              </section>
            )}

            <section
              aria-labelledby="results-title"
              className={`${panel} overflow-hidden`}
            >
              <div className="flex items-center justify-between border-b border-[var(--pg-border)] px-5 py-3.5">
                <h3
                  id="results-title"
                  className="flex items-center gap-2 text-xs font-semibold"
                >
                  <Terminal size={14} aria-hidden="true" />
                  Output & tests
                </h3>
                <span className="font-mono text-[10px] text-[var(--pg-muted)]">
                  {report
                    ? `${report.passed}/${report.total} passed · ${Math.round((report.passed / report.total) * 100)}%`
                    : `${challenge.tests.length} test cases`}
                </span>
              </div>
              <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="px-5 py-4"
              >
                {run.phase === "idle" && (
                  <p className="flex items-center gap-2 text-xs leading-6 text-[var(--pg-muted)]">
                    <span className="font-mono text-[var(--pg-accent)]">❯</span>
                    Your next win starts with a run. Results will appear here.
                  </p>
                )}
                {run.phase === "running" && (
                  <p className="flex items-center gap-2 text-xs leading-6 text-[var(--pg-muted)]">
                    <LoaderCircle
                      size={14}
                      className="animate-spin motion-reduce:animate-none"
                      aria-hidden="true"
                    />
                    Compiling and checking {challenge.tests.length} test cases…
                  </p>
                )}
                {run.phase === "error" && (
                  <p className="rounded-lg bg-[var(--pg-warning-bg)] px-3 py-2 text-xs leading-6 text-[var(--pg-warning)]">
                    {run.message} No correctness result was recorded.
                  </p>
                )}
                {report && (
                  <div
                    className={`flex items-start gap-3 rounded-xl p-3 ${report.verdict === "correct" ? "bg-[var(--pg-success-bg)] text-[var(--pg-success)]" : "bg-[var(--pg-error-bg)] text-[var(--pg-error)]"}`}
                  >
                    {report.verdict === "correct" ? (
                      <CheckCheck
                        size={18}
                        className="mt-0.5 shrink-0"
                        aria-hidden="true"
                      />
                    ) : (
                      <X
                        size={18}
                        className="mt-0.5 shrink-0"
                        aria-hidden="true"
                      />
                    )}
                    <div>
                      <p className="text-sm font-semibold">
                        {report.verdict === "correct"
                          ? "Correct! One more win in your collection."
                          : "Not quite yet. You’ve got another try."}
                      </p>
                      <p className="mt-1 text-xs leading-5">
                        {report.passed} of {report.total} cases passed · score {Math.round((report.passed / report.total) * 100)}%.
                        {report.verdict === "incorrect"
                          ? " Compare the expected and actual output below."
                          : " Your passing code has been collected on this device."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {report && (
                <>
                  <div
                    className="flex flex-wrap gap-2 px-5 pb-4"
                    aria-label="Test cases"
                  >
                    {report.tests.map((test, index) => (
                      <button
                        key={test.id}
                        type="button"
                        aria-pressed={selectedResult === index}
                        onClick={() => setSelectedResult(index)}
                        className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg border px-2.5 text-[11px] ${selectedResult === index ? "border-[var(--pg-accent)] bg-[var(--pg-soft)]" : "border-[var(--pg-border)]"}`}
                      >
                        {test.passed ? (
                          <Check
                            size={12}
                            className="text-[var(--pg-success)]"
                            aria-hidden="true"
                          />
                        ) : (
                          <X
                            size={12}
                            className="text-[var(--pg-error)]"
                            aria-hidden="true"
                          />
                        )}
                        Case {index + 1}
                      </button>
                    ))}
                  </div>
                  {result && <TestDetails result={result} />}
                </>
              )}
            </section>
            <p className="px-1 text-[10px] leading-5 text-[var(--pg-muted)]">
              Run sends your code and the exercise’s test inputs to this site’s
              code-execution service. Correct means all published cases passed;
              it isn’t a proof for every possible input.
            </p>
          </div>
        </div>

        <section aria-labelledby="practice-backup-title" className={`${panel} mt-8 p-5 sm:p-6`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="max-w-xl">
              <h2 id="practice-backup-title" className="text-lg font-semibold tracking-tight">Take your practice with you.</h2>
              <p className="mb-0 mt-2 text-xs leading-6 text-[var(--pg-muted)]">
                Export your drafts, saved solutions, and progress. Restore them in another browser whenever you are ready. No account needed.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" disabled={!ready || isRunning} onClick={downloadPractice} className={`${smallButton} border border-[var(--pg-border)]`}>
                <Download size={14} aria-hidden="true" /> Export practice backup
              </button>
              <button type="button" disabled={!ready || isRunning || readingBackup} onClick={() => importInputRef.current?.click()} className={`${smallButton} border border-[var(--pg-border)]`}>
                <Upload size={14} aria-hidden="true" /> {readingBackup ? "Reading backup…" : "Restore backup"}
              </button>
              <input
                ref={importInputRef}
                type="file"
                accept="application/json,.json"
                aria-label="Choose a practice backup file"
                className="hidden"
                disabled={!ready || isRunning || readingBackup}
                onChange={(event) => void readBackup(event.target.files?.[0])}
              />
            </div>
          </div>
          {backupError && <p role="alert" className="mb-0 mt-4 rounded-lg bg-[var(--pg-error-bg)] px-4 py-3 text-xs leading-6 text-[var(--pg-error)]">{backupError}</p>}
          {pendingBackup && (
            <section ref={importPanelRef} tabIndex={-1} aria-labelledby="restore-backup-title" className="mt-5 rounded-xl border border-[var(--pg-border)] bg-[var(--pg-soft)] p-4 sm:p-5">
              <h3 id="restore-backup-title" className="text-sm font-semibold">Review your backup</h3>
              <p className="mt-2 break-words text-xs leading-6 text-[var(--pg-muted)]">
                {pendingBackup.name} · {Object.keys(pendingBackup.backup.progress.drafts).length} drafts · {pendingBackup.backup.progress.answers.length} saved solutions
              </p>
              <fieldset className="space-y-3">
                <legend className="mb-3 text-xs font-semibold">How would you like to restore it?</legend>
                <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-[var(--pg-border)] bg-[var(--pg-panel)] p-3">
                  <input type="radio" name="practice-restore-mode" value="merge" checked={restoreMode === "merge"} onChange={() => { setRestoreMode("merge"); setReplaceConfirmed(false); }} className="mt-1 h-4 w-4 accent-[var(--pg-accent)]" />
                  <span className="text-xs leading-6"><strong className="block">Merge and keep my current work</strong><span className="text-[var(--pg-muted)]">Add missing drafts and solutions. Where both copies have work for the same exercise and language, this browser’s copy stays.</span></span>
                </label>
                <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-[var(--pg-border)] bg-[var(--pg-panel)] p-3">
                  <input type="radio" name="practice-restore-mode" value="replace" checked={restoreMode === "replace"} onChange={() => { setRestoreMode("replace"); setReplaceConfirmed(false); }} className="mt-1 h-4 w-4 accent-[var(--pg-accent)]" />
                  <span className="text-xs leading-6"><strong className="block">Replace this browser’s practice</strong><span className="text-[var(--pg-muted)]">Restore only the backup, including its selected language and exercise. Export your current work first if you want to keep a separate copy.</span></span>
                </label>
              </fieldset>
              {restoreMode === "replace" && (
                <label className="mt-4 flex cursor-pointer items-start gap-3 text-xs leading-6">
                  <input type="checkbox" checked={replaceConfirmed} onChange={(event) => setReplaceConfirmed(event.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-[var(--pg-accent)]" />
                  <span>I understand that this replaces all practice currently saved in this browser.</span>
                </label>
              )}
              <p className="mt-4 text-xs leading-6 text-[var(--pg-muted)]">Restoring a backup brings back saved pass records; it does not run the imported code. You can run tests again in the editor.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={confirmRestore} disabled={isRunning || (restoreMode === "replace" && !replaceConfirmed)} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[var(--pg-accent)] px-4 text-xs font-semibold text-[var(--pg-accent-ink)] disabled:opacity-50">
                  <Upload size={14} aria-hidden="true" /> {restoreMode === "merge" ? "Merge backup" : "Replace local practice"}
                </button>
                <button type="button" onClick={() => { setPendingBackup(null); setReplaceConfirmed(false); }} className={smallButton}>Cancel restore</button>
              </div>
            </section>
          )}
        </section>

        <section
          ref={collectionRef}
          aria-labelledby="collection-title"
          className="scroll-mt-28 pt-9"
        >
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--pg-accent)]">
                Keep the good stuff
              </p>
              <h2
                id="collection-title"
                className="flex items-center gap-2 text-xl font-semibold tracking-tight"
              >
                Your solution collection{" "}
                <span className="rounded-full bg-[var(--pg-soft)] px-2 py-0.5 text-xs font-normal text-[var(--pg-muted)]">
                  {progress.answers.length}/{totalPairs}
                </span>
              </h2>
              <p className="mt-1.5 text-xs leading-5 text-[var(--pg-muted)]">
                Correct submissions, saved in this browser. Come back, revisit,
                and build on them.
              </p>
            </div>
            <button
              type="button"
              onClick={downloadAnswers}
              disabled={progress.answers.length === 0}
              className={`${smallButton} border border-[var(--pg-border)] bg-[var(--pg-panel)]`}
            >
              <Download size={13} aria-hidden="true" />
              Download answers
            </button>
          </div>
          {progress.answers.length === 0 ? (
            <div
              className={`${panel} flex flex-col items-center justify-center gap-3 px-5 py-10 text-center`}
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--pg-accent-soft)] text-[var(--pg-accent)]">
                <Trophy size={21} aria-hidden="true" />
              </div>
              <h3 className="text-sm font-semibold">
                Your first win belongs right here.
              </h3>
              <p className="max-w-sm text-xs leading-6 text-[var(--pg-muted)]">
                Pass every test in a challenge and we’ll collect your answer
                automatically. There’s no account to set up.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {progress.answers.map((answer) => {
                const savedChallenge = getChallenge(answer.challengeId)!;
                const savedLanguage = getLanguage(answer.language)!;
                return (
                  <article
                    key={answerKey(answer.language, answer.challengeId)}
                    className={`${panel} overflow-hidden p-4`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className={`grid h-8 min-w-8 place-items-center rounded-lg px-1.5 font-mono text-xs font-bold ${languageBadges[answer.language].color}`}
                      >
                        {languageBadges[answer.language].badge}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--pg-success-bg)] px-2 py-1 text-[9px] font-medium text-[var(--pg-success)]">
                        <Check size={10} aria-hidden="true" />
                        {answer.passed}/{answer.total} passed
                      </span>
                    </div>
                    <h3 className="mt-3 text-sm font-semibold">
                      {savedChallenge.title}
                    </h3>
                    <p className="mt-1 text-[10px] text-[var(--pg-muted)]">
                      {savedLanguage.label} ·{" "}
                      {answer.guided ? "Guided" : "Independent"} ·{" "}
                      {new Intl.DateTimeFormat(undefined, {
                        month: "short",
                        day: "numeric",
                      }).format(new Date(answer.savedAt))}
                    </p>
                    <details className="mt-3">
                      <summary className="cursor-pointer rounded text-[11px] text-[var(--pg-accent)]">
                        View saved code
                      </summary>
                      <pre
                        tabIndex={0}
                        className="mt-2 max-h-56 overflow-auto rounded-lg bg-[var(--pg-soft)] p-3 text-[11px] leading-5"
                      >
                        <code>{answer.sourceCode}</code>
                      </pre>
                    </details>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-1 border-t border-[var(--pg-border)] pt-2">
                      <button
                        type="button"
                        onClick={() => openAnswer(answer)}
                        className={smallButton}
                      >
                        <FileCode2 size={12} aria-hidden="true" />
                        Open
                      </button>
                      <div className="flex">
                        <button
                          type="button"
                          onClick={() =>
                            copy(answer.sourceCode, "Saved answer copied.")
                          }
                          className={smallButton}
                          aria-label={`Copy ${savedLanguage.label} solution for ${savedChallenge.title}`}
                        >
                          <Copy size={12} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setProgress((current) => ({
                              ...current,
                              answers: current.answers.filter(
                                (item) =>
                                  answerKey(item.language, item.challengeId) !==
                                  answerKey(
                                    answer.language,
                                    answer.challengeId,
                                  ),
                              ),
                            }))
                          }
                          className={smallButton}
                          aria-label={`Remove ${savedLanguage.label} solution for ${savedChallenge.title}`}
                        >
                          <Trash2 size={12} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
          </>
        )}

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--pg-border)] pt-5 text-[10px] leading-5 text-[var(--pg-muted)]">
          <span>{isNotFound ? "Some wrong turns lead to good things. Keep going." : "One small exercise at a time. Keep building."}</span>
          <Link
            href="/"
            className="inline-flex min-h-10 items-center gap-1.5 rounded font-medium"
          >
            Ready to head home? <ArrowUpRight size={12} aria-hidden="true" />
          </Link>
        </footer>
      </div>
      {notice && (
        <div
          role="status"
          className="fixed bottom-28 left-1/2 z-[60] sm:bottom-5 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-between gap-3 rounded-xl border border-[var(--pg-border)] bg-[var(--pg-panel)] px-4 py-3 text-xs leading-5 shadow-lg"
        >
          {notice}
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="grid h-7 w-7 shrink-0 place-items-center rounded-md hover:bg-[var(--pg-soft)]"
            aria-label="Dismiss notification"
          >
            <X size={13} />
          </button>
        </div>
      )}
    </main>
  );
}

function Example({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl border border-[var(--pg-border)] bg-[var(--pg-soft)] px-3.5 py-2.5">
      <p className="mb-1.5 text-[9px] font-semibold uppercase tracking-widest text-[var(--pg-muted)]">
        {label}
      </p>
      <pre className="overflow-auto font-mono text-xs leading-5 text-[var(--pg-fg)]">
        {value.trimEnd() || "(empty line)"}
      </pre>
    </div>
  );
}

function TestDetails({ result }: { result: TestResult }) {
  const labels = {
    passed: "Passed",
    wrong_answer: "Wrong answer",
    compile_error: "Compilation error",
    runtime_error: "Runtime error",
    time_limit: "Time limit exceeded",
  };
  return (
    <div className="border-t border-[var(--pg-border)] bg-[var(--pg-soft)] p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-[11px]">
        <span className="font-medium">{result.label}</span>
        <span
          className={
            result.passed
              ? "text-[var(--pg-success)]"
              : "text-[var(--pg-error)]"
          }
        >
          {labels[result.status]}
          {result.timeMs !== null ? ` · ${result.timeMs} ms` : ""}
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Example label="Input" value={result.input} />
        <Example label="Expected output" value={result.expected} />
        <Example label="Your output" value={visibleOutput(result.actual)} />
      </div>
      {result.stderr && (
        <div className="mt-3">
          <p className="mb-1.5 text-[10px] font-medium text-[var(--pg-error)]">
            Compiler / runtime messages
          </p>
          <pre
            tabIndex={0}
            className="max-h-48 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-[var(--pg-panel)] p-3 font-mono text-xs leading-5 text-[var(--pg-error)]"
          >
            {result.stderr}
          </pre>
        </div>
      )}
      {result.outputTruncated && (
        <p className="mt-2 text-[10px] text-[var(--pg-muted)]">
          Output display shortened. The full output was used for grading.
        </p>
      )}
    </div>
  );
}
