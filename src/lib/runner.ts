import type { LanguageId } from "./challenges";

export const MAX_SOURCE_BYTES = 32_768;
export const MAX_REQUEST_BYTES = 49_152;
export const MAX_TESTS = 4;

const MAX_PROVIDER_BYTES = 2_097_152;
const MAX_DISPLAY_BYTES = 8_192;

const LANGUAGE_IDS: LanguageId[] = ["python", "javascript", "java", "c", "cpp"];

export class RunnerError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly httpStatus = 503,
  ) {
    super(message);
    this.name = "RunnerError";
  }
}

export interface RunnerConfig {
  baseUrl: string;
  headers: Record<string, string>;
  languageIds: Partial<Record<LanguageId, number>>;
  deadlineMs: number;
  requestTimeoutMs: number;
  pollIntervalMs: number;
}

export interface RunRequest {
  language: LanguageId;
  challengeId: string;
  sourceCode: string;
}

export interface RunnerTest {
  id: string;
  label: string;
  input: string;
  expected: string;
}

export type TestStatus =
  "passed" | "wrong_answer" | "compile_error" | "runtime_error" | "time_limit";

export interface TestResult extends RunnerTest {
  actual: string;
  stderr: string;
  status: TestStatus;
  passed: boolean;
  timeMs: number | null;
  outputTruncated: boolean;
}

export interface RunReport {
  verdict: "correct" | "incorrect";
  passed: number;
  total: number;
  tests: TestResult[];
  completedAt: string;
}

interface JudgeSubmission {
  token: string;
  status: { id: number; description?: string };
  stdout?: string | null;
  stderr?: string | null;
  compile_output?: string | null;
  time?: string | null;
  exit_code?: number | null;
  exit_signal?: number | null;
}

export interface RunnerDependencies {
  fetch?: typeof fetch;
  now?: () => number;
  sleep?: (milliseconds: number, signal?: AbortSignal) => Promise<void>;
  signal?: AbortSignal;
}

type Environment = Record<string, string | undefined>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function invalidConfiguration(): RunnerError {
  return new RunnerError(
    "invalid_configuration",
    "The code runner needs a configuration update.",
  );
}

function providerError(): RunnerError {
  return new RunnerError(
    "provider_error",
    "The execution service could not complete this run. Please try again.",
    502,
  );
}

function cancelled(): RunnerError {
  return new RunnerError("cancelled", "The run was cancelled.", 499);
}

function timedOut(): RunnerError {
  return new RunnerError(
    "provider_timeout",
    "The execution service took too long to respond. Please try again.",
    504,
  );
}

function isDocumentationHostname(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/\.$/, "");
  return [
    "example",
    "invalid",
    "example.com",
    "example.net",
    "example.org",
  ].some((domain) => host === domain || host.endsWith(`.${domain}`));
}

export function loadRunnerConfig(env: Environment = process.env): RunnerConfig {
  // Judge0 CE exposes a public community instance that does not require an API
  // key for basic use. A custom endpoint can still be supplied when deploying.
  const base = env.JUDGE0_BASE_URL?.trim() || "https://ce.judge0.com";
  const authToken = env.JUDGE0_AUTH_TOKEN?.trim();
  const bearer = env.JUDGE0_BEARER_TOKEN?.trim();
  const rapidKey = env.JUDGE0_RAPIDAPI_KEY?.trim();

  if ([authToken, bearer, rapidKey].filter(Boolean).length > 1) {
    throw invalidConfiguration();
  }

  let url: URL;

  try {
    url = new URL(base);
  } catch {
    throw invalidConfiguration();
  }

  const localDevelopment =
    env.NODE_ENV !== "production" &&
    ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);

  if (
    (url.protocol !== "https:" &&
      !(url.protocol === "http:" && localDevelopment)) ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    isDocumentationHostname(url.hostname)
  ) {
    throw invalidConfiguration();
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (authToken) headers["X-Auth-Token"] = authToken;
  if (bearer) headers.Authorization = `Bearer ${bearer}`;

  if (rapidKey) {
    const host = env.JUDGE0_RAPIDAPI_HOST?.trim() || url.hostname;

    if (host !== url.hostname) throw invalidConfiguration();

    headers["X-RapidAPI-Key"] = rapidKey;
    headers["X-RapidAPI-Host"] = host;
  }

  let languageIds: Partial<Record<LanguageId, number>> =
    url.origin === "https://ce.judge0.com"
      ? { python: 71, javascript: 63, java: 62, c: 50, cpp: 54 }
      : {};

  if (env.JUDGE0_LANGUAGE_IDS?.trim()) {
    try {
      const parsed: unknown = JSON.parse(env.JUDGE0_LANGUAGE_IDS);

      if (
        !isRecord(parsed) ||
        Object.entries(parsed).some(
          ([language, id]) =>
            !LANGUAGE_IDS.includes(language as LanguageId) ||
            !Number.isSafeInteger(id) ||
            Number(id) <= 0,
        )
      ) {
        throw new Error("Invalid language map");
      }

      languageIds = parsed as Partial<Record<LanguageId, number>>;
    } catch {
      throw invalidConfiguration();
    }
  }

  return {
    baseUrl: url.toString().replace(/\/+$/, ""),
    headers,
    languageIds,
    deadlineMs: 45_000,
    requestTimeoutMs: 6_000,
    pollIntervalMs: 900,
  };
}

export function normalizeOutput(output: string): string {
  return output.replace(/\r\n?/g, "\n").trimEnd();
}

function decodeOutput(value: string | null | undefined): string {
  if (value === null || value === undefined) return "";
  if (typeof value !== "string") throw providerError();

  const encoded = value.replace(/[\r\n]/g, "");

  if (encoded.length % 4 !== 0 || !/^[A-Za-z0-9+/]*={0,2}$/.test(encoded)) {
    throw providerError();
  }

  return Buffer.from(encoded, "base64").toString("utf8");
}

function displayOutput(output: string): { text: string; truncated: boolean } {
  const bytes = Buffer.from(output, "utf8");

  if (bytes.length <= MAX_DISPLAY_BYTES) {
    return { text: output, truncated: false };
  }

  return {
    text:
      bytes.subarray(0, MAX_DISPLAY_BYTES).toString("utf8") +
      "\n… output truncated …",
    truncated: true,
  };
}

export function gradeSubmission(
  test: RunnerTest,
  submission: JudgeSubmission,
): TestResult {
  const statusId = submission.status?.id;

  if (
    !Number.isInteger(statusId) ||
    statusId < 3 ||
    statusId > 14 ||
    statusId === 13
  ) {
    throw providerError();
  }

  if (statusId === 3 && !("stdout" in submission)) {
    throw providerError();
  }

  const actual = decodeOutput(submission.stdout);

  const diagnostics = [
    decodeOutput(submission.compile_output),
    decodeOutput(submission.stderr),
  ]
    .filter(Boolean)
    .join("\n");

  const exitedCleanly =
    (submission.exit_code == null || submission.exit_code === 0) &&
    (submission.exit_signal == null || submission.exit_signal === 0);

  let status: TestStatus;

  if (statusId === 5) {
    status = "time_limit";
  } else if (statusId === 6) {
    status = "compile_error";
  } else if (statusId >= 7 || !exitedCleanly) {
    status = "runtime_error";
  } else if (
    statusId === 3 &&
    normalizeOutput(actual) === normalizeOutput(test.expected)
  ) {
    status = "passed";
  } else {
    status = "wrong_answer";
  }

  // Compare the complete output before shortening it for the UI.
  const output = displayOutput(actual);
  const error = displayOutput(diagnostics);
  const seconds = submission.time == null ? NaN : Number(submission.time);

  return {
    ...test,
    actual: output.text,
    stderr: error.text,
    status,
    passed: status === "passed",
    timeMs:
      Number.isFinite(seconds) && seconds >= 0
        ? Math.round(seconds * 1000)
        : null,
    outputTruncated: output.truncated || error.truncated,
  };
}

async function sleep(
  milliseconds: number,
  signal?: AbortSignal,
): Promise<void> {
  if (signal?.aborted) throw cancelled();

  await new Promise<void>((resolve, reject) => {
    const abort = () => {
      clearTimeout(timer);
      reject(cancelled());
    };

    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", abort);
      resolve();
    }, milliseconds);

    signal?.addEventListener("abort", abort, { once: true });
  });
}

async function readLimitedJson(response: Response): Promise<unknown> {
  const declaredSize = Number(response.headers.get("content-length"));

  if (declaredSize > MAX_PROVIDER_BYTES || !response.body) {
    throw providerError();
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      size += value.byteLength;

      if (size > MAX_PROVIDER_BYTES) {
        await reader.cancel();
        throw providerError();
      }

      chunks.push(value);
    }

    return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown;
  } catch (error) {
    if (error instanceof RunnerError) throw error;
    throw providerError();
  } finally {
    reader.releaseLock();
  }
}

interface CachedLanguages {
  baseUrl: string;
  expires: number;
  ids: Partial<Record<LanguageId, number>>;
}

let cachedLanguages: CachedLanguages | undefined;

function compareVersions(left: number[], right: number[]): number {
  for (let i = 0; i < Math.max(left.length, right.length); i++) {
    const difference = (left[i] || 0) - (right[i] || 0);

    if (difference) return difference;
  }

  return 0;
}

export function selectLanguageIds(
  languages: unknown,
): Partial<Record<LanguageId, number>> {
  if (!Array.isArray(languages)) throw providerError();

  const patterns: Record<LanguageId, RegExp> = {
    python: /^Python\s*\((3(?:\.\d+)*)\b/i,
    javascript: /^JavaScript\s*\(Node\.?js\s+(\d+(?:\.\d+)*)\b/i,
    java: /^Java\s*\((?:OpenJDK|JDK)\s+(\d+(?:\.\d+)*)\b/i,
    c: /^C\s*\((GCC|Clang)\s+(\d+(?:\.\d+)*)\b/i,
    cpp: /^C\+\+\s*\((GCC|Clang)\s+(\d+(?:\.\d+)*)\b/i,
  };

  const selected: Partial<
    Record<
      LanguageId,
      {
        id: number;
        version: number[];
        preference: number;
      }
    >
  > = {};

  for (const entry of languages) {
    if (
      !isRecord(entry) ||
      !Number.isSafeInteger(entry.id) ||
      Number(entry.id) <= 0 ||
      typeof entry.name !== "string" ||
      entry.is_archived === true
    ) {
      continue;
    }

    for (const language of LANGUAGE_IDS) {
      const match = entry.name.match(patterns[language]);

      if (!match) continue;

      const compiled = language === "c" || language === "cpp";
      const version = match[compiled ? 2 : 1].split(".").map(Number);
      const preference = compiled && match[1].toLowerCase() === "gcc" ? 1 : 0;

      const previous = selected[language];

      const newer =
        !previous ||
        preference > previous.preference ||
        (preference === previous.preference &&
          compareVersions(version, previous.version) > 0);

      if (newer) {
        selected[language] = {
          id: Number(entry.id),
          version,
          preference,
        };
      }
    }
  }

  return Object.fromEntries(
    Object.entries(selected).map(([language, item]) => [language, item.id]),
  );
}

export async function runChallenge(
  request: RunRequest,
  tests: readonly RunnerTest[],
  config: RunnerConfig,
  dependencies: RunnerDependencies = {},
): Promise<RunReport> {
  if (
    !request.sourceCode.trim() ||
    Buffer.byteLength(request.sourceCode, "utf8") > MAX_SOURCE_BYTES ||
    !LANGUAGE_IDS.includes(request.language) ||
    tests.length < 1 ||
    tests.length > MAX_TESTS
  ) {
    throw new RunnerError(
      "invalid_request",
      "Choose a challenge and add code under 32 KB before running.",
      400,
    );
  }

  const fetcher = dependencies.fetch || fetch;
  const now = dependencies.now || Date.now;
  const wait = dependencies.sleep || sleep;
  const deadline = now() + config.deadlineMs;
  const { signal } = dependencies;

  const call = async (
    path: string,
    init: RequestInit = {},
  ): Promise<unknown> => {
    if (signal?.aborted) throw cancelled();

    const remaining = deadline - now();

    if (remaining <= 0) throw timedOut();

    const controller = new AbortController();

    let rejectCancellation: ((reason: RunnerError) => void) | undefined;

    const cancellation = new Promise<never>((_, reject) => {
      rejectCancellation = reject;
    });

    const onAbort = () => {
      controller.abort();
      rejectCancellation?.(cancelled());
    };

    signal?.addEventListener("abort", onAbort, { once: true });

    let timer: ReturnType<typeof setTimeout> | undefined;

    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(
        () => {
          controller.abort();
          reject(timedOut());
        },
        Math.min(config.requestTimeoutMs, remaining),
      );
    });

    try {
      return await Promise.race([
        (async () => {
          const response = await fetcher(`${config.baseUrl}${path}`, {
            ...init,
            headers: config.headers,
            signal: controller.signal,
            redirect: "error",
            cache: "no-store",
          });

          if (!response.ok) {
            await response.body?.cancel();

            if (response.status === 429) {
              throw new RunnerError(
                "provider_busy",
                "The execution service is busy. Please try again shortly.",
                503,
              );
            }

            throw providerError();
          }

          return readLimitedJson(response);
        })(),
        timeout,
        cancellation,
      ]);
    } catch (error) {
      if (error instanceof RunnerError) throw error;
      if (signal?.aborted) throw cancelled();
      if (controller.signal.aborted) throw timedOut();

      throw providerError();
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener("abort", onAbort);
    }
  };

  let languageId = config.languageIds[request.language];

  if (!languageId) {
    if (
      !dependencies.fetch &&
      cachedLanguages?.baseUrl === config.baseUrl &&
      cachedLanguages.expires > now()
    ) {
      languageId = cachedLanguages.ids[request.language];
    } else {
      const ids = selectLanguageIds(await call("/languages"));

      if (!dependencies.fetch) {
        cachedLanguages = {
          baseUrl: config.baseUrl,
          expires: now() + 600_000,
          ids,
        };
      }

      languageId = ids[request.language];
    }
  }

  if (!languageId) {
    throw new RunnerError(
      "language_unavailable",
      "This language is not available on the connected runner.",
      503,
    );
  }

  const sourceCode = Buffer.from(request.sourceCode, "utf8").toString("base64");

  const submissions = tests.map((test) => ({
    source_code: sourceCode,
    language_id: languageId,
    stdin: Buffer.from(test.input, "utf8").toString("base64"),
    cpu_time_limit: 2,
    cpu_extra_time: 0.5,
    wall_time_limit: 5,
    memory_limit: 256_000,
    stack_limit: 64_000,
    max_processes_and_or_threads: 60,
    max_file_size: 64,
    enable_network: false,
    redirect_stderr_to_stdout: false,
    number_of_runs: 1,
  }));

  // Do not automatically retry a submission POST.
  const created = await call("/submissions/batch?base64_encoded=true", {
    method: "POST",
    body: JSON.stringify({ submissions }),
  });

  if (!Array.isArray(created) || created.length !== tests.length) {
    throw providerError();
  }

  const tokens = created.map((entry) => {
    if (
      !isRecord(entry) ||
      typeof entry.token !== "string" ||
      !/^[A-Za-z0-9-]{1,100}$/.test(entry.token)
    ) {
      throw providerError();
    }

    return entry.token;
  });

  if (new Set(tokens).size !== tokens.length) throw providerError();

  const query = new URLSearchParams({
    tokens: tokens.join(","),
    base64_encoded: "true",
    fields:
      "token,status,stdout,stderr,compile_output,time,exit_code,exit_signal",
  });

  while (true) {
    if (signal?.aborted) throw cancelled();
    if (now() >= deadline) throw timedOut();

    const data = await call(`/submissions/batch?${query}`);

    if (
      !isRecord(data) ||
      !Array.isArray(data.submissions) ||
      data.submissions.length !== tokens.length
    ) {
      throw providerError();
    }

    const byToken = new Map<string, JudgeSubmission>();

    for (const item of data.submissions) {
      if (
        !isRecord(item) ||
        typeof item.token !== "string" ||
        !tokens.includes(item.token) ||
        byToken.has(item.token) ||
        !isRecord(item.status) ||
        !Number.isInteger(item.status.id) ||
        Number(item.status.id) < 1 ||
        Number(item.status.id) > 14 ||
        Number(item.status.id) === 13
      ) {
        throw providerError();
      }

      byToken.set(item.token, item as unknown as JudgeSubmission);
    }

    if ([...byToken.values()].every((item) => item.status.id > 2)) {
      const results = tokens.map((token, index) =>
        gradeSubmission(tests[index], byToken.get(token)!),
      );

      const passed = results.filter((result) => result.passed).length;

      return {
        verdict: passed === results.length ? "correct" : "incorrect",
        passed,
        total: results.length,
        tests: results,
        completedAt: new Date(now()).toISOString(),
      };
    }

    const remaining = deadline - now();

    if (remaining <= 0) throw timedOut();

    await wait(Math.min(config.pollIntervalMs, remaining), signal);
  }
}

// Per-process protection. Multiple replicas need a shared/edge limiter.
export class RunLimiter {
  private windowStarted = 0;
  private started = 0;
  private active = 0;

  constructor(
    private readonly perMinute = 10,
    private readonly concurrent = 2,
  ) {}

  acquire(now = Date.now()): () => void {
    if (now - this.windowStarted >= 60_000) {
      this.windowStarted = now;
      this.started = 0;
    }

    if (this.started >= this.perMinute || this.active >= this.concurrent) {
      throw new RunnerError(
        "rate_limited",
        "The playground is busy. Please wait a minute and try again.",
        429,
      );
    }

    this.started++;
    this.active++;

    let released = false;

    return () => {
      if (!released) {
        this.active--;
        released = true;
      }
    };
  }
}
