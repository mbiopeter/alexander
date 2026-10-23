import assert from "node:assert/strict";
import test from "node:test";
import { GET, POST } from "../src/app/api/playground/run/route";
import {
  gradeSubmission,
  loadRunnerConfig,
  normalizeOutput,
  runChallenge,
  RunLimiter,
  RunnerError,
  selectLanguageIds,
  type RunnerConfig,
  type RunnerTest,
} from "../src/lib/runner";

const encode = (text: string) => Buffer.from(text, "utf8").toString("base64");
const json = (value: unknown, status = 200) =>
  new Response(JSON.stringify(value), {
    status,
    headers: { "Content-Type": "application/json" },
  });
const config: RunnerConfig = {
  baseUrl: "https://runner.test",
  headers: {
    "X-Auth-Token": "test-secret",
    "Content-Type": "application/json",
  },
  languageIds: { python: 71 },
  deadlineMs: 1000,
  requestTimeoutMs: 200,
  pollIntervalMs: 1,
};
const request = {
  language: "python" as const,
  challengeId: "example",
  sourceCode: "print(input())",
};
const cases: RunnerTest[] = [
  { id: "first", label: "First", input: "first\n", expected: "first\n" },
  { id: "second", label: "Second", input: "second\n", expected: "second\n" },
];
const done = (token: string, stdout: string, status = 3) => ({
  token,
  status: { id: status },
  stdout: encode(stdout),
  stderr: null,
  compile_output: null,
  exit_code: 0,
  time: "0.012",
});

test("configuration fails closed without a server endpoint and secret", () => {
  assert.throws(
    () => loadRunnerConfig({}),
    (error) => error instanceof RunnerError && error.code === "not_configured",
  );
  assert.throws(
    () => loadRunnerConfig({ JUDGE0_BASE_URL: "https://runner.test" }),
    RunnerError,
  );
  assert.throws(
    () =>
      loadRunnerConfig({
        JUDGE0_BASE_URL: "https://user:password@runner.test",
        JUDGE0_AUTH_TOKEN: "secret",
      }),
    RunnerError,
  );
  assert.throws(
    () =>
      loadRunnerConfig({
        JUDGE0_BASE_URL: "http://runner.test",
        JUDGE0_AUTH_TOKEN: "secret",
        NODE_ENV: "production",
      }),
    RunnerError,
  );
  assert.throws(
    () =>
      loadRunnerConfig({
        JUDGE0_BASE_URL: "https://runner.test",
        JUDGE0_AUTH_TOKEN: "secret",
        JUDGE0_LANGUAGE_IDS: '{"shell":46}',
      }),
    RunnerError,
  );
});

test("configuration supports server-only bearer and RapidAPI schemes", () => {
  const bearer = loadRunnerConfig({
    JUDGE0_BASE_URL: "https://runner.test/v1/",
    JUDGE0_BEARER_TOKEN: "secret",
    JUDGE0_LANGUAGE_IDS: '{"python":113}',
    NODE_ENV: "production",
  });
  assert.equal(bearer.baseUrl, "https://runner.test/v1");
  assert.equal(bearer.headers.Authorization, "Bearer secret");
  assert.equal(bearer.languageIds.python, 113);
  const rapid = loadRunnerConfig({
    JUDGE0_BASE_URL: "https://judge0-ce.p.rapidapi.com",
    JUDGE0_RAPIDAPI_KEY: "secret",
  });
  assert.equal(rapid.headers["X-RapidAPI-Host"], "judge0-ce.p.rapidapi.com");
  assert.throws(
    () =>
      loadRunnerConfig({
        JUDGE0_BASE_URL: "https://runner.test",
        JUDGE0_RAPIDAPI_KEY: "secret",
        JUDGE0_RAPIDAPI_HOST: "unrelated.example",
      }),
    RunnerError,
  );
});

test("configuration rejects documentation placeholders and preserves local development hosts", () => {
  for (const hostname of [
    "runner.example",
    "runner.invalid",
    "example.com",
    "api.example.com",
    "example.net",
    "service.example.org",
    "runner.example.",
  ]) {
    assert.throws(
      () =>
        loadRunnerConfig({
          JUDGE0_BASE_URL: `https://${hostname}`,
          JUDGE0_AUTH_TOKEN: "test-secret",
        }),
      (error) =>
        error instanceof RunnerError && error.code === "invalid_configuration",
    );
  }
  for (const baseUrl of [
    "http://localhost:2358",
    "http://127.0.0.1:2358",
    "https://runner.test",
  ]) {
    assert.equal(
      loadRunnerConfig({
        JUDGE0_BASE_URL: baseUrl,
        JUDGE0_AUTH_TOKEN: "test-secret",
        NODE_ENV: "development",
      }).baseUrl,
      baseUrl,
    );
  }
});

test("output comparison tolerates EOF whitespace and CRLF but preserves content", () => {
  assert.equal(normalizeOutput("a\r\nb\n  \n"), "a\nb");
  const example = {
    id: "x",
    label: "UTF-8",
    input: "",
    expected: "hello 世界\n",
  };
  assert.equal(
    gradeSubmission(example, done("x", "hello 世界\r\n")).passed,
    true,
  );
  assert.equal(
    gradeSubmission(example, done("x", " hello 世界\n")).passed,
    false,
  );
  assert.equal(
    gradeSubmission(example, done("x", "hello 世界\nextra")).passed,
    false,
  );
  assert.equal(
    gradeSubmission(example, { ...done("x", "hello 世界"), exit_code: 1 })
      .status,
    "runtime_error",
  );
});

test("compiler/runtime/time-limit failures stay distinct from wrong answers", () => {
  const expected = { ...cases[0], expected: "42" };
  assert.equal(
    gradeSubmission(expected, done("x", "40")).status,
    "wrong_answer",
  );
  const compilation = gradeSubmission(expected, {
    ...done("x", "", 6),
    compile_output: encode("Syntax error on line 2"),
  });
  assert.equal(compilation.status, "compile_error");
  assert.match(compilation.stderr, /Syntax error/);
  assert.equal(
    gradeSubmission(expected, done("x", "", 5)).status,
    "time_limit",
  );
  assert.equal(
    gradeSubmission(expected, done("x", "", 11)).status,
    "runtime_error",
  );
  assert.throws(
    () => gradeSubmission(expected, done("x", "", 13)),
    RunnerError,
  );
});

test("long output is graded before display truncation", () => {
  const result = gradeSubmission(
    { ...cases[0], expected: "42" },
    done("x", "42" + "x".repeat(20_000)),
  );
  assert.equal(result.passed, false);
  assert.equal(result.outputTruncated, true);
  assert.ok(result.actual.length < 9_000);
  assert.throws(
    () => gradeSubmission(cases[0], { ...done("x", ""), stdout: "%%%" }),
    RunnerError,
  );
});

test("runtime discovery selects versions numerically and does not confuse Java/JavaScript/C/C++", () => {
  const ids = selectLanguageIds([
    { id: 1, name: "Python (2.7.17)" },
    { id: 2, name: "Python (3.9.9)" },
    { id: 3, name: "Python (3.13.2)" },
    { id: 4, name: "Python (3.99.0)", is_archived: true },
    { id: 5, name: "JavaScript (Node.js 22.8.0)" },
    { id: 6, name: "Java (JDK 17.0.6)" },
    { id: 7, name: "JavaFX (JDK 17.0.6, OpenJFX 22.0.2)" },
    { id: 8, name: "C (Clang 19.1.7)" },
    { id: 9, name: "C (GCC 14.1.0)" },
    { id: 10, name: "C++ (GCC 14.1.0)" },
  ]);
  assert.deepEqual(ids, { python: 3, javascript: 5, java: 6, c: 9, cpp: 10 });
});

test("batch polling maps tokens, handles pending work, and submits bounded execution options", async () => {
  let polls = 0;
  let posts = 0;
  let clock = 0;
  const fakeFetch: typeof fetch = async (input, options) => {
    assert.equal(options?.redirect, "error");
    if (options?.method === "POST") {
      posts++;
      const body = JSON.parse(String(options.body));
      assert.equal(body.submissions.length, 2);
      assert.equal(
        Buffer.from(body.submissions[0].source_code, "base64").toString(),
        request.sourceCode,
      );
      assert.equal(body.submissions[0].enable_network, false);
      assert.equal(body.submissions[0].cpu_time_limit, 2);
      assert.equal(body.submissions[0].wall_time_limit, 5);
      assert.equal(body.submissions[0].number_of_runs, 1);
      assert.equal(body.submissions[0].expected_output, undefined);
      assert.equal(body.submissions[0].callback_url, undefined);
      return json([{ token: "token-first" }, { token: "token-second" }], 201);
    }
    assert.match(String(input), /base64_encoded=true/);
    polls++;
    return polls === 1
      ? json({
          submissions: [
            done("token-second", "second"),
            { token: "token-first", status: { id: 2 } },
          ],
        })
      : json({
          submissions: [
            done("token-second", "second"),
            done("token-first", "first\r\n"),
          ],
        });
  };
  const result = await runChallenge(request, cases, config, {
    fetch: fakeFetch,
    now: () => clock,
    sleep: async (ms) => {
      clock += ms;
    },
  });
  assert.equal(result.verdict, "correct");
  assert.equal(result.passed, 2);
  assert.deepEqual(
    result.tests.map((item) => item.id),
    ["first", "second"],
  );
  assert.deepEqual(
    result.tests.map((item) => item.actual),
    ["first\r\n", "second"],
  );
  assert.equal(result.tests[0].timeMs, 12);
  assert.equal(posts, 1);
  assert.equal(polls, 2);
});

test("mixed completed statuses report incorrect without losing passing tests", async () => {
  const result = await runChallenge(request, cases, config, {
    fetch: async (_, init) =>
      init?.method === "POST"
        ? json([{ token: "a" }, { token: "b" }], 201)
        : json({ submissions: [done("a", "first"), done("b", "not second")] }),
  });
  assert.equal(result.verdict, "incorrect");
  assert.equal(result.passed, 1);
  assert.equal(result.tests[1].status, "wrong_answer");
});

test("provider internal errors and missing tokens never become incorrect grades", async () => {
  for (const payload of [
    { submissions: [done("a", "first"), done("b", "", 13)] },
    { submissions: [done("a", "first"), done("unknown", "second")] },
    { submissions: [done("a", "first"), done("a", "second")] },
  ]) {
    await assert.rejects(
      runChallenge(request, cases, config, {
        fetch: async (_, init) =>
          init?.method === "POST"
            ? json([{ token: "a" }, { token: "b" }], 201)
            : json(payload),
      }),
      (error) =>
        error instanceof RunnerError && error.code === "provider_error",
    );
  }
});

test("a partially rejected batch fails and the billable POST is never retried", async () => {
  let calls = 0;
  await assert.rejects(
    runChallenge(request, cases, config, {
      fetch: async () => {
        calls++;
        return json([{ token: "a" }, { language_id: ["unavailable"] }], 201);
      },
    }),
    RunnerError,
  );
  assert.equal(calls, 1);
});

test("unavailable transport does not retry or expose provider secrets", async () => {
  let calls = 0;
  await assert.rejects(
    runChallenge(request, cases, config, {
      fetch: async () => {
        calls++;
        throw new Error("sensitive provider configuration");
      },
    }),
    (error) =>
      error instanceof RunnerError &&
      error.code === "provider_error" &&
      !error.message.includes("sensitive"),
  );
  assert.equal(calls, 1);
});

test("queue deadlines return provider_timeout rather than a learner time-limit failure", async () => {
  let clock = 0;
  await assert.rejects(
    runChallenge(
      request,
      cases,
      { ...config, deadlineMs: 4 },
      {
        now: () => clock,
        sleep: async (ms) => {
          clock += ms;
        },
        fetch: async (_, init) =>
          init?.method === "POST"
            ? json([{ token: "a" }, { token: "b" }], 201)
            : json({
                submissions: [
                  { token: "a", status: { id: 1 } },
                  { token: "b", status: { id: 2 } },
                ],
              }),
      },
    ),
    (error) =>
      error instanceof RunnerError && error.code === "provider_timeout",
  );
});

test("a hanging request is bounded even when the transport ignores abort", async () => {
  await assert.rejects(
    runChallenge(
      request,
      cases,
      { ...config, requestTimeoutMs: 15 },
      {
        fetch: async () => new Promise<Response>(() => {}),
      },
    ),
    (error) =>
      error instanceof RunnerError && error.code === "provider_timeout",
  );
});

test("cancelled requests do not start execution", async () => {
  const controller = new AbortController();
  controller.abort();
  let calls = 0;
  await assert.rejects(
    runChallenge(request, cases, config, {
      signal: controller.signal,
      fetch: async () => {
        calls++;
        return json({});
      },
    }),
    (error) => error instanceof RunnerError && error.code === "cancelled",
  );
  assert.equal(calls, 0);
});

test("source and test-count bounds are enforced before contacting the provider", async () => {
  let calls = 0;
  const dependencies = {
    fetch: (async () => {
      calls++;
      return json({});
    }) as typeof fetch,
  };
  await assert.rejects(
    runChallenge(
      { ...request, sourceCode: "é".repeat(17_000) },
      cases,
      config,
      dependencies,
    ),
    RunnerError,
  );
  await assert.rejects(
    runChallenge(request, [...cases, ...cases, cases[0]], config, dependencies),
    RunnerError,
  );
  assert.equal(calls, 0);
});

test("per-process admission bounds concurrency, permits release once, and resets its budget", () => {
  const limiter = new RunLimiter(2, 1);
  const release = limiter.acquire(60_000);
  assert.throws(
    () => limiter.acquire(60_001),
    (error) => error instanceof RunnerError && error.httpStatus === 429,
  );
  release();
  release();
  limiter.acquire(60_002)();
  assert.throws(() => limiter.acquire(60_003), RunnerError);
  limiter.acquire(120_001)();
});

function apiRequest(
  body: unknown,
  origin = "https://playground.example",
  contentType = "application/json",
) {
  return new Request("https://playground.example/api/playground/run", {
    method: "POST",
    headers: { Origin: origin, "Content-Type": contentType },
    body: JSON.stringify(body),
  });
}

test("route rejects cross-site requests before reaching the execution service", async () => {
  const response = await POST(
    apiRequest(
      { ...request, challengeId: "sum-two" },
      "https://unrelated.example",
    ),
  );
  assert.equal(response.status, 403);
  assert.equal((await response.json()).error.code, "forbidden_origin");
});

test("route rejects unknown challenges, unsupported languages, and non-JSON payloads", async () => {
  assert.equal(
    (await POST(apiRequest({ ...request, challengeId: "does-not-exist" })))
      .status,
    400,
  );
  assert.equal(
    (
      await POST(
        apiRequest({ ...request, challengeId: "sum-two", language: "bash" }),
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await POST(
        apiRequest(
          { ...request, challengeId: "sum-two" },
          "https://playground.example",
          "text/plain",
        ),
      )
    ).status,
    415,
  );
});

test("route enforces the streamed body bound without relying on Content-Length", async () => {
  const response = await POST(
    apiRequest({
      ...request,
      challengeId: "sum-two",
      sourceCode: "x".repeat(60_000),
    }),
  );
  assert.equal(response.status, 413);
  assert.equal((await response.json()).error.code, "too_large");
});

test("runner readiness response contains only a configuration boolean", async () => {
  const previous = process.env.JUDGE0_BASE_URL;
  try {
    delete process.env.JUDGE0_BASE_URL;
    const response = await GET();
    assert.deepEqual(await response.json(), { configured: false });
    assert.equal(response.headers.get("cache-control"), "no-store");
  } finally {
    if (previous === undefined) delete process.env.JUDGE0_BASE_URL;
    else process.env.JUDGE0_BASE_URL = previous;
  }
});
