"use client";

import { useEffect, useRef, useState } from "react";
import {
  CHALLENGES,
  LANGUAGES,
  getChallenge,
  isLanguageId,
  type LanguageId,
} from "./challenges";

export const PROGRESS_KEY = "detour-playground:progress:v1";
export const MAX_SOURCE_CHARS = 32_768;
export const MAX_BACKUP_BYTES = 8 * 1024 * 1024;
const MAX_PAIRS = CHALLENGES.length * LANGUAGES.length;

export interface CollectedAnswer {
  language: LanguageId;
  challengeId: string;
  sourceCode: string;
  savedAt: string;
  passed: number;
  total: number;
  guided: boolean;
}

export interface Progress {
  version: 1;
  language: LanguageId;
  challengeId: string;
  drafts: Record<string, string>;
  answers: CollectedAnswer[];
  revealed: string[];
}

export interface PracticeBackup {
  format: "alexender-playground-backup";
  version: 1;
  exportedAt: string;
  progress: Progress;
}

export type RestoreMode = "merge" | "replace";

/** The editor, browser persistence, and backup format share this draft limit. */
export function isDraftWithinLimit(source: string): boolean {
  return source.length <= MAX_SOURCE_CHARS;
}

export function answerKey(
  language: LanguageId,
  challengeId: string,
): string {
  return `${language}:${challengeId}`;
}

export function emptyProgress(): Progress {
  return {
    version: 1,
    language: "python",
    challengeId: CHALLENGES[0].id,
    drafts: {},
    answers: [],
    revealed: [],
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validKey(key: string): boolean {
  const [language, challengeId, extra] = key.split(":");

  return (
    extra === undefined &&
    isLanguageId(language) &&
    Boolean(getChallenge(challengeId))
  );
}

export function collectAnswer(
  progress: Progress,
  answer: CollectedAnswer,
): Progress {
  const challenge = getChallenge(answer.challengeId);

  if (
    !challenge ||
    answer.passed !== challenge.tests.length ||
    answer.total !== answer.passed
  ) {
    return progress;
  }

  const key = answerKey(answer.language, answer.challengeId);

  return {
    ...progress,
    answers: [
      answer,
      ...progress.answers.filter(
        (saved) => answerKey(saved.language, saved.challengeId) !== key,
      ),
    ],
  };
}

export function readProgress(raw: string | null): Progress {
  const initial = emptyProgress();

  if (!raw || raw.length > MAX_BACKUP_BYTES) return initial;

  let value: unknown;

  try {
    value = JSON.parse(raw);
  } catch {
    return initial;
  }

  if (!isRecord(value) || value.version !== 1) return initial;

  if (isLanguageId(value.language)) {
    initial.language = value.language;
  }

  if (
    typeof value.challengeId === "string" &&
    getChallenge(value.challengeId)
  ) {
    initial.challengeId = value.challengeId;
  }

  if (isRecord(value.drafts)) {
    for (const [key, draft] of Object.entries(value.drafts)) {
      if (
        validKey(key) &&
        typeof draft === "string" &&
        isDraftWithinLimit(draft)
      ) {
        initial.drafts[key] = draft;
      }
    }
  }

  if (Array.isArray(value.revealed)) {
    initial.revealed = [
      ...new Set(
        value.revealed.filter(
          (key): key is string =>
            typeof key === "string" && validKey(key),
        ),
      ),
    ];
  }

  if (Array.isArray(value.answers)) {
    for (const candidate of value.answers.slice(0, 100).reverse()) {
      if (
        !isRecord(candidate) ||
        !isLanguageId(candidate.language) ||
        typeof candidate.challengeId !== "string"
      ) {
        continue;
      }

      const challenge = getChallenge(candidate.challengeId);

      if (
        !challenge ||
        typeof candidate.sourceCode !== "string" ||
        !isDraftWithinLimit(candidate.sourceCode) ||
        typeof candidate.savedAt !== "string" ||
        !Number.isFinite(Date.parse(candidate.savedAt)) ||
        candidate.total !== challenge.tests.length ||
        candidate.passed !== candidate.total ||
        typeof candidate.guided !== "boolean"
      ) {
        continue;
      }

      initial.answers = collectAnswer(initial, {
        language: candidate.language,
        challengeId: candidate.challengeId,
        sourceCode: candidate.sourceCode,
        savedAt: candidate.savedAt,
        passed: candidate.passed as number,
        total: candidate.total as number,
        guided: candidate.guided,
      }).answers;
    }
  }

  return initial;
}

/** Import is strict: malformed backups never silently erase or trim work. */
export function parsePracticeBackup(raw: string): PracticeBackup {
  if (new TextEncoder().encode(raw).length > MAX_BACKUP_BYTES) {
    throw new Error("Choose a practice backup smaller than 8 MB.");
  }
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    throw new Error("This file is not valid JSON. Choose an exported practice backup.");
  }
  if (
    !isRecord(value) ||
    value.format !== "alexender-playground-backup" ||
    value.version !== 1 ||
    typeof value.exportedAt !== "string" ||
    !Number.isFinite(Date.parse(value.exportedAt)) ||
    !isRecord(value.progress)
  ) {
    throw new Error("Choose a full Alexender practice backup. An answers-only export cannot restore drafts.");
  }
  const state = value.progress;
  if (
    state.version !== 1 ||
    !isLanguageId(state.language) ||
    typeof state.challengeId !== "string" ||
    !getChallenge(state.challengeId) ||
    !isRecord(state.drafts) ||
    !Array.isArray(state.answers) ||
    !Array.isArray(state.revealed) ||
    Object.keys(state.drafts).length > MAX_PAIRS ||
    state.answers.length > MAX_PAIRS ||
    state.revealed.length > MAX_PAIRS
  ) {
    throw new Error("The backup contains unsupported practice data. Nothing has been changed.");
  }
  if (Object.entries(state.drafts).some(([key, draft]) =>
    !validKey(key) || typeof draft !== "string" || !isDraftWithinLimit(draft),
  )) {
    throw new Error("The backup contains an invalid or oversized draft. Nothing has been changed.");
  }
  if (
    state.revealed.some((key) => typeof key !== "string" || !validKey(key)) ||
    new Set(state.revealed).size !== state.revealed.length
  ) {
    throw new Error("The backup contains invalid guided-practice records. Nothing has been changed.");
  }
  const answerKeys = new Set<string>();
  for (const answer of state.answers) {
    if (
      !isRecord(answer) || !isLanguageId(answer.language) ||
      typeof answer.challengeId !== "string" ||
      typeof answer.sourceCode !== "string" || !isDraftWithinLimit(answer.sourceCode) ||
      typeof answer.savedAt !== "string" || !Number.isFinite(Date.parse(answer.savedAt)) ||
      typeof answer.guided !== "boolean"
    ) {
      throw new Error("The backup contains an invalid saved solution. Nothing has been changed.");
    }
    const challenge = getChallenge(answer.challengeId);
    const key = answerKey(answer.language, answer.challengeId);
    if (!challenge || answer.total !== challenge.tests.length || answer.passed !== answer.total || answerKeys.has(key)) {
      throw new Error("The backup contains an invalid or duplicate pass record. Nothing has been changed.");
    }
    answerKeys.add(key);
  }
  // Rebuild known fields rather than adopting arbitrary properties from a file.
  const progress = readProgress(JSON.stringify(state));
  return { format: "alexender-playground-backup", version: 1, exportedAt: value.exportedAt, progress };
}

export function serializePracticeBackup(progress: Progress): string {
  const raw = JSON.stringify({
    format: "alexender-playground-backup",
    version: 1,
    exportedAt: new Date().toISOString(),
    progress,
  }, null, 2);
  parsePracticeBackup(raw);
  return raw;
}

/** Merge keeps this browser's drafts, answers, and selection on conflicts. */
export function restorePractice(current: Progress, incoming: Progress, mode: RestoreMode): Progress {
  if (mode === "replace") return readProgress(JSON.stringify(incoming));
  const existing = new Set(current.answers.map((answer) => answerKey(answer.language, answer.challengeId)));
  return {
    ...current,
    drafts: { ...incoming.drafts, ...current.drafts },
    answers: [
      ...current.answers,
      ...incoming.answers.filter((answer) => !existing.has(answerKey(answer.language, answer.challengeId))),
    ],
    revealed: [...new Set([...current.revealed, ...incoming.revealed])],
  };
}

export function selectionFromSearch(search: string): Partial<Pick<Progress, "language" | "challengeId">> {
  const params = new URLSearchParams(search);
  const language = params.get("language");
  const challengeId = params.get("challenge");
  return {
    ...(isLanguageId(language) ? { language } : {}),
    ...(challengeId && getChallenge(challengeId) ? { challengeId } : {}),
  };
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(emptyProgress);
  const [ready, setReady] = useState(false);
  const [storageNote, setStorageNote] = useState<string | null>(null);

  const latest = useRef(progress);
  const hydrated = useRef(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    initialized.current = true;

    try {
      const restored = readProgress(
        window.localStorage.getItem(PROGRESS_KEY),
      );

      latest.current = restored;
      setProgress(restored);
    } catch {
      setStorageNote(
        "Browser storage is unavailable. Export a practice backup before leaving.",
      );
    }

    hydrated.current = true;
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) latest.current = progress;
  }, [progress, ready]);

  useEffect(() => {
    if (!ready) return;

    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(
          PROGRESS_KEY,
          JSON.stringify(progress),
        );
        setStorageNote(null);
      } catch {
        setStorageNote(
          "Your browser could not save this draft. Copy your code or export a practice backup before leaving.",
        );
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, [progress, ready]);

  useEffect(() => {
    const flush = () => {
      if (!hydrated.current) return;

      try {
        window.localStorage.setItem(
          PROGRESS_KEY,
          JSON.stringify(latest.current),
        );
      } catch {
        // The visible save notice handles storage errors.
      }
    };

    window.addEventListener("pagehide", flush);

    return () => {
      flush();
      window.removeEventListener("pagehide", flush);
    };
  }, []);

  return { progress, setProgress, ready, storageNote };
}
