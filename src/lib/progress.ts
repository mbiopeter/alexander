"use client";

import { useEffect, useRef, useState } from "react";
import {
  CHALLENGES,
  getChallenge,
  isLanguageId,
  type LanguageId,
} from "./challenges";

export const PROGRESS_KEY = "detour-playground:progress:v1";
const MAX_SOURCE_CHARS = 32_768;

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

  if (!raw || raw.length > 2_000_000) return initial;

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
        draft.length <= MAX_SOURCE_CHARS
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
    for (const candidate of value.answers.slice(0, 100)) {
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
        candidate.sourceCode.length > MAX_SOURCE_CHARS ||
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
        "Browser storage is unavailable. Download your answers before leaving.",
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
          "Your browser could not save this draft. Copy your code or download your answers before leaving.",
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