"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, Braces, Check, Copy, Play, Terminal } from "lucide-react";

const sampleTasks = [
  { id: 1, title: "Learn how GET requests work", completed: true },
  { id: 2, title: "Build a useful first endpoint", completed: false },
  { id: 3, title: "Write a helpful error response", completed: false },
  { id: 4, title: "Learn to filter a list", completed: true },
];
type ApiResult = { status: number; label: string; body: unknown };

function simulateRequest(endpoint: string, query: string): ApiResult {
  const params = new URLSearchParams(query.replace(/^\?/, ""));
  if (endpoint === "/api/tasks/99/")
    return {
      status: 404,
      label: "Not Found",
      body: { detail: "No task matches the given ID." },
    };
  if (endpoint === "/api/tasks/1/")
    return { status: 200, label: "OK", body: sampleTasks[0] };
  for (const key of params.keys()) {
    if (!["search", "completed", "limit"].includes(key))
      return {
        status: 400,
        label: "Bad Request",
        body: { [key]: "Unknown parameter. Try search, completed, or limit." },
      };
  }
  const completed = params.get("completed");
  if (completed !== null && completed !== "true" && completed !== "false")
    return {
      status: 400,
      label: "Bad Request",
      body: { completed: "Use true or false." },
    };
  const rawLimit = params.get("limit");
  if (
    rawLimit !== null &&
    (!/^\d+$/.test(rawLimit) || Number(rawLimit) < 1 || Number(rawLimit) > 50)
  )
    return {
      status: 400,
      label: "Bad Request",
      body: { limit: "Use a whole number from 1 to 50." },
    };
  const search = (params.get("search") ?? "").trim().toLowerCase();
  const matching = sampleTasks.filter(
    (task) =>
      (completed === null || task.completed === (completed === "true")) &&
      task.title.toLowerCase().includes(search),
  );
  const limit = rawLimit ? Number(rawLimit) : 50;
  return {
    status: 200,
    label: "OK",
    body: { count: matching.length, results: matching.slice(0, limit) },
  };
}

const pythonSketch = `from rest_framework import serializers, viewsets
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ["id", "title", "completed"]

class TaskViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer`;

export function DjangoApiLab() {
  const [endpoint, setEndpoint] = useState("/api/tasks/");
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<ApiResult>(() =>
    simulateRequest("/api/tasks/", ""),
  );
  const [lastRequest, setLastRequest] = useState("/api/tasks/");
  const [pending, setPending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyNotice, setCopyNotice] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = useId();
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const requestPath =
    endpoint +
    (endpoint === "/api/tasks/" && query.trim()
      ? `?${query.trim().replace(/^\?/, "")}`
      : "");
  const responseText = JSON.stringify(response.body, null, 2);

  function runRequest() {
    if (timer.current) clearTimeout(timer.current);
    setPending(true);
    setCopied(false);
    setCopyNotice("");
    const nextResponse = simulateRequest(
      endpoint,
      endpoint === "/api/tasks/" ? query : "",
    );
    const nextPath = requestPath;
    timer.current = setTimeout(() => {
      setResponse(nextResponse);
      setLastRequest(nextPath);
      setPending(false);
    }, 250);
  }

  async function copyResponse() {
    try {
      await navigator.clipboard.writeText(responseText);
      setCopied(true);
      setCopyNotice("Response copied.");
    } catch {
      setCopyNotice(
        "Copy is unavailable here. Select the JSON and copy it manually.",
      );
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-(--line) bg-(--surface)">

      <div className="border-b border-(--line) bg-(--surface-soft) p-5 sm:p-7">

        <p className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-(--green)">
          <Terminal size={15} /> SIMULATED API · RUNS IN YOUR BROWSER
        </p>
        <h2 className="!mb-2 !text-2xl !tracking-tight">
          A request. A response. A clearer idea.
        </h2>
        <p className="mb-0 max-w-2xl text-sm leading-relaxed text-(--muted)">
          Use local sample data to explore the shape of a REST API. No Python
          server runs here and no network request is sent.
        </p>

      </div>
      <div className="grid gap-7 p-5 sm:p-7 lg:grid-cols-[.85fr_1.15fr]">

        <div>

          <div className="mb-5">

            <label
              htmlFor={`${id}-endpoint`}
              className="mb-2 block text-xs font-medium">
              Choose a GET endpoint
            </label>
            <select
              id={`${id}-endpoint`}
              value={endpoint}
              onChange={(event) => {
                setEndpoint(event.target.value);
                setCopied(false);
              }}
              className="w-full rounded-xl border border-(--line) bg-(--surface) px-3.5 py-3 font-mono text-sm">
              <option value="/api/tasks/">/api/tasks/ — task list</option>
              <option value="/api/tasks/1/">/api/tasks/1/ — one task</option>
              <option value="/api/tasks/99/">
                /api/tasks/99/ — missing task
              </option>

            </select>

          </div>
          <div className="mb-5">

            <label
              htmlFor={`${id}-query`}
              className="mb-2 block text-xs font-medium">
              Query parameters{" "}
              
              <span className="font-normal text-(--muted)">
                (list endpoint)
              </span>

            </label>
            <input
              id={`${id}-query`}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              disabled={endpoint !== "/api/tasks/"}
              placeholder="completed=false&limit=2"
              maxLength={200}
              className="w-full rounded-xl border border-(--line) bg-(--surface) px-3.5 py-3 font-mono text-xs disabled:opacity-50"
              aria-describedby={`${id}-query-hint`}/>
            <p
              id={`${id}-query-hint`}
              className="mb-0 mt-2 text-xs leading-relaxed text-(--muted)">
              Try <code>search=learn</code>, <code>completed=false</code>, or{" "}
              <code>limit=2</code>. An invalid value returns a simulated 400
              response.
            </p>

          </div>
          <div
            className="mb-5 flex flex-wrap gap-2"
            role="group"
            aria-label="Sample queries">
            {[
              { label: "Open tasks", value: "completed=false" },
              { label: "Search “learn”", value: "search=learn" },
              { label: "Try an error", value: "limit=zero" },
            ].map(({ label, value }) => (
              <button
                type="button"
                key={label}
                onClick={() => {
                  setEndpoint("/api/tasks/");
                  setQuery(value);
                }}
                className="min-h-9 rounded-full border border-(--line) px-3 text-[11px] text-(--muted) hover:text-(--text)">
                {label}
              </button>
            ))}
          </div>
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-(--line) bg-(--surface-soft) p-3 font-mono text-xs">

            <span className="shrink-0 font-semibold text-(--green)">
              GET
            </span>
            <span className="min-w-0 break-all">{requestPath}</span>

          </div>
          <button
            type="button"
            onClick={runRequest}
            disabled={pending}
            className="button button-primary">
            <Play size={15} fill="currentColor" />
            {pending ? "Simulating…" : "Run simulated request"}
            <ArrowRight size={16} />
          </button>
          <div className="mt-6 rounded-xl border border-(--line) bg-(--surface-soft) p-4">

            <h3 className="mb-2 text-xs font-semibold">What to look for</h3>
            <p className="mb-0 text-xs leading-relaxed text-(--muted)">
              200 means the request succeeded. 400 means a parameter needs
              attention. 404 means the requested task was not found.{" "}
              <code>count</code> shows all matching tasks before the limit is
              applied.
            </p>

          </div>

        </div>
        <div className="min-w-0">

          <div
            className="overflow-hidden rounded-xl border border-(--line) bg-[#1c2521] text-[#e2eadb]"
            aria-busy={pending}>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-4">

              <span className="font-mono text-xs" role="status">
                {pending
                  ? "Running local simulation…"
                  : `${response.status} ${response.label}`}
              </span>
              <button
                type="button"
                onClick={copyResponse}
                className="flex min-h-8 items-center gap-2 rounded-md px-2 text-[11px] text-[#bcc9b7] hover:bg-white/5">
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? "Copied" : "Copy JSON"}
              </button>

            </div>
            <p className="mb-0 break-all border-b border-white/10 px-4 py-3 font-mono text-[10px] text-[#a9bda0]">
              Response for GET {lastRequest}
            </p>
            <pre className="min-h-72 overflow-x-auto p-5 text-xs leading-relaxed">
              <code>{responseText}</code>
            </pre>

          </div>
          <p
            className="mb-0 mt-3 min-h-5 text-xs text-(--muted)"
            role="status">
            {copyNotice}
          </p>

        </div>

      </div>
      <details className="border-t border-(--line)">

        <summary className="flex cursor-pointer items-center gap-2 p-5 text-sm font-semibold sm:px-7">

          <Braces size={17} />
          See the Django REST idea behind it
          <span className="ml-auto text-xs font-normal text-(--muted)">
            Python sketch
          </span>

        </summary>
        <div className="grid gap-5 px-5 pb-7 sm:px-7 lg:grid-cols-[.8fr_1.2fr]">

          <div>

            <p className="text-sm leading-relaxed text-(--muted)">
              A serializer defines the response fields. A read-only viewset can
              expose list and detail endpoints. This small sketch assumes an
              existing Task model.
            </p>
            <p className="mb-0 text-xs leading-relaxed text-(--muted)">
              It is an illustration, not the code running above. A real Django
              project would also need routing, settings, and the
              query-validation logic demonstrated in the simulation.
            </p>
          </div>
          <pre className="min-w-0 overflow-x-auto rounded-xl bg-[#1c2521] p-5 text-[11px] leading-relaxed text-[#d8e5d0]">
            <code>{pythonSketch}</code>
          </pre>

        </div>

      </details>
      
    </div>
  );
}
