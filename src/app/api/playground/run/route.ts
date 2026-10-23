import { getChallenge, isLanguageId } from "@/lib/challenges";

import {
  loadRunnerConfig,
  MAX_REQUEST_BYTES,
  MAX_SOURCE_BYTES,
  runChallenge,
  RunLimiter,
  RunnerError,
  type RunRequest,
} from "@/lib/runner";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const limiter = new RunLimiter(10, 2);

const responseHeaders = {
  "Cache-Control": "no-store",
  Vary: "Origin",
};

export async function GET() {
  try {
    loadRunnerConfig();

    return Response.json({ configured: true }, { headers: responseHeaders });
  } catch {
    return Response.json({ configured: false }, { headers: responseHeaders });
  }
}

function assertSameOrigin(request: Request): void {
  const origin = request.headers.get("origin");

  let expected: string;

  try {
    expected = new URL(process.env.PLAYGROUND_ORIGIN || request.url).origin;
  } catch {
    throw new RunnerError(
      "not_configured",
      "The code runner is not enabled on this deployment yet.",
    );
  }

  if (
    !origin ||
    origin !== expected ||
    request.headers.get("sec-fetch-site") === "cross-site"
  ) {
    throw new RunnerError(
      "forbidden_origin",
      "Run code from this website's playground.",
      403,
    );
  }
}

async function readRequest(request: Request): Promise<RunRequest> {
  if (
    !/^application\/json(?:\s*;|$)/i.test(
      request.headers.get("content-type") || "",
    )
  ) {
    throw new RunnerError(
      "invalid_request",
      "Send the run request as JSON.",
      415,
    );
  }

  if (
    Number(request.headers.get("content-length")) > MAX_REQUEST_BYTES ||
    !request.body
  ) {
    throw new RunnerError("too_large", "Keep your code under 32 KB.", 413);
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];

  let length = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      length += value.byteLength;

      if (length > MAX_REQUEST_BYTES) {
        await reader.cancel();

        throw new RunnerError("too_large", "Keep your code under 32 KB.", 413);
      }

      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  let body: unknown;

  try {
    body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new RunnerError(
      "invalid_request",
      "The run request could not be read.",
      400,
    );
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    throw new RunnerError(
      "invalid_request",
      "Choose a language and a challenge before running.",
      400,
    );
  }

  const record = body as Record<string, unknown>;

  if (
    !isLanguageId(record.language) ||
    typeof record.challengeId !== "string" ||
    record.challengeId.length > 80 ||
    !getChallenge(record.challengeId) ||
    typeof record.sourceCode !== "string" ||
    !record.sourceCode.trim()
  ) {
    throw new RunnerError(
      "invalid_request",
      "Choose a language, a challenge, and add your code before running.",
      400,
    );
  }

  if (Buffer.byteLength(record.sourceCode, "utf8") > MAX_SOURCE_BYTES) {
    throw new RunnerError("too_large", "Keep your code under 32 KB.", 413);
  }

  return {
    language: record.language,
    challengeId: record.challengeId,
    sourceCode: record.sourceCode,
  };
}

export async function POST(request: Request) {
  let release: (() => void) | undefined;

  try {
    assertSameOrigin(request);

    const submission = await readRequest(request);
    const config = loadRunnerConfig();

    release = limiter.acquire();

    const challenge = getChallenge(submission.challengeId)!;

    const report = await runChallenge(submission, challenge.tests, config, {
      signal: request.signal,
    });

    return Response.json(report, {
      headers: responseHeaders,
    });
  } catch (error) {
    const known =
      error instanceof RunnerError
        ? error
        : new RunnerError(
            "server_error",
            "The run could not be completed. Please try again.",
            500,
          );

    return Response.json(
      {
        error: {
          code: known.code,
          message: known.message,
        },
      },
      {
        status: known.httpStatus,
        headers: {
          ...responseHeaders,
          ...(known.httpStatus === 429 ? { "Retry-After": "60" } : {}),
        },
      },
    );
  } finally {
    release?.();
  }
}
