"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import {
  Check,
  ClipboardList,
  Edit3,
  HardDrive,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { readBoardTasks, type BoardTask } from "@/lib/demo-utils";

const STORAGE_KEY = "alexender-focusboard-v1";
const samples: BoardTask[] = [
  {
    id: "sample-plan",
    title: "Write a simple project brief",
    detail: "What should the first version help someone do?",
    priority: "high",
    completed: true,
  },
  {
    id: "sample-build",
    title: "Build the first useful feature",
    detail: "Start small. Make the main interaction work well.",
    priority: "high",
    completed: false,
  },
  {
    id: "sample-test",
    title: "Try it on a smaller screen",
    detail: "Check the layout, buttons, and keyboard navigation.",
    priority: "medium",
    completed: false,
  },
];
const field =
  "w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3.5 py-3 text-sm text-[var(--text)] placeholder:text-[var(--muted)] focus-visible:outline-[var(--green)]";
type Filter = "all" | "active" | "done";

export function Focusboard() {
  const [tasks, setTasks] = useState<BoardTask[]>([]);
  const [ready, setReady] = useState(false);
  const [storageMessage, setStorageMessage] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [priority, setPriority] = useState<BoardTask["priority"]>("medium");
  const [editing, setEditing] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const titleInput = useRef<HTMLInputElement>(null);
  const id = useId();

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        const restored = readBoardTasks(saved);
        if (restored) setTasks(restored);
        else
          setStorageMessage(
            "The saved board could not be read. You can start a fresh board or load the sample tasks.",
          );
      } else {
        setTasks(samples.map((task) => ({ ...task })));
      }
    } catch {
      setTasks(samples.map((task) => ({ ...task })));
      setStorageMessage(
        "Browser storage is unavailable. Your changes will last for this visit only.",
      );
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      setStorageMessage(
        "Your browser could not save this board. Keep this tab open to retain your changes.",
      );
    }
  }, [tasks, ready]);

  const completed = tasks.filter((task) => task.completed).length;
  const percentage = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;
  const visible = useMemo(
    () =>
      tasks.filter((task) => {
        const matchesState =
          filter === "all" ||
          (filter === "done" ? task.completed : !task.completed);
        return (
          matchesState &&
          `${task.title} ${task.detail}`
            .toLowerCase()
            .includes(query.trim().toLowerCase())
        );
      }),
    [tasks, filter, query],
  );

  function clearEditor() {
    setEditing(null);
    setTitle("");
    setDetail("");
    setPriority("medium");
    setError("");
  }

  function saveTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) {
      setError("Give your task a short title.");
      titleInput.current?.focus();
      return;
    }
    if (!editing && tasks.length >= 100) {
      setError(
        "This demo holds up to 100 tasks. Remove a task before adding another.",
      );
      return;
    }
    if (editing) {
      setTasks((current) =>
        current.map((task) =>
          task.id === editing
            ? { ...task, title: title.trim(), detail: detail.trim(), priority }
            : task,
        ),
      );
    } else {
      const taskId =
        typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `task-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setTasks((current) => [
        ...current,
        {
          id: taskId,
          title: title.trim(),
          detail: detail.trim(),
          priority,
          completed: false,
        },
      ]);
      setFilter("all");
      setQuery("");
    }
    clearEditor();
  }

  function editTask(task: BoardTask) {
    setEditing(task.id);
    setTitle(task.title);
    setDetail(task.detail);
    setPriority(task.priority);
    setError("");
    titleInput.current?.focus();
  }

  function resetSample() {
    setTasks(samples.map((task) => ({ ...task })));
    clearEditor();
    setQuery("");
    setFilter("all");
    setConfirmReset(false);
  }

  if (!ready)
    return (
      <div
        className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-10 text-sm text-[var(--muted)]"
        role="status"
      >
        Opening your board…
      </div>
    );

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)]">
      <div className="flex flex-col justify-between gap-4 border-b border-[var(--line)] bg-[var(--surface-soft)] p-5 sm:flex-row sm:items-center sm:p-7">
        <div>
          <p className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--green)]">
            <ClipboardList size={15} /> YOUR PERSONAL WORKSPACE
          </p>
          <h2 className="!mb-0 !text-2xl !tracking-tight">
            A little focus goes a long way.
          </h2>
        </div>
        <span className="inline-flex items-center gap-2 text-xs text-[var(--muted)]">
          <HardDrive size={15} />
          {storageMessage ? "This browser only" : "Saved on this device"}
        </span>
      </div>
      {storageMessage && (
        <p
          role="status"
          className="m-5 rounded-lg border border-[var(--line)] bg-[var(--surface-soft)] p-3 text-xs leading-relaxed text-[var(--muted)]"
        >
          {storageMessage}
        </p>
      )}
      <div className="grid gap-8 p-5 sm:p-7 lg:grid-cols-[.75fr_1.25fr]">
        <div>
          <form onSubmit={saveTask} className="space-y-4">
            <h3 className="text-base font-semibold">
              {editing ? "Refine your task" : "What’s the next step?"}
            </h3>
            <div>
              <label
                htmlFor={`${id}-title`}
                className="mb-2 block text-xs font-medium"
              >
                Task title
              </label>
              <input
                ref={titleInput}
                id={`${id}-title`}
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  setError("");
                }}
                maxLength={80}
                placeholder="Something worth getting done"
                className={field}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${id}-error` : undefined}
              />
            </div>
            <div>
              <label
                htmlFor={`${id}-detail`}
                className="mb-2 block text-xs font-medium"
              >
                A little detail{" "}
                <span className="font-normal text-[var(--muted)]">
                  (optional)
                </span>
              </label>
              <textarea
                id={`${id}-detail`}
                value={detail}
                onChange={(event) => setDetail(event.target.value)}
                maxLength={280}
                rows={3}
                placeholder="What would make this task clearer?"
                className={`${field} resize-y`}
              />
            </div>
            <div>
              <label
                htmlFor={`${id}-priority`}
                className="mb-2 block text-xs font-medium"
              >
                Priority
              </label>
              <select
                id={`${id}-priority`}
                className={field}
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value as BoardTask["priority"])
                }
              >
                <option value="low">Low — whenever there’s room</option>
                <option value="medium">Medium — keep it moving</option>
                <option value="high">High — start here</option>
              </select>
            </div>
            {error && (
              <p
                id={`${id}-error`}
                role="alert"
                className="text-xs font-medium text-[var(--text)]"
              >
                {error}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <button type="submit" className="button button-primary">
                {editing ? <Check size={16} /> : <Plus size={16} />}
                {editing ? "Save changes" : "Add task"}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={clearEditor}
                  className="button button-outline"
                >
                  <X size={15} />
                  Cancel
                </button>
              )}
            </div>
          </form>
          <div className="mt-7 border-t border-[var(--line)] pt-5">
            <p className="mb-3 text-xs leading-relaxed text-[var(--muted)]">
              A sample board starts things off on your first visit. Your edits
              stay in this browser. There is no account or cloud sync.
            </p>
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="inline-flex min-h-10 items-center gap-2 text-xs font-medium text-[var(--muted)] hover:text-[var(--text)]"
            >
              <RotateCcw size={14} />
              Load sample tasks
            </button>
            {confirmReset && (
              <div className="mt-3 rounded-xl border border-[var(--line)] bg-[var(--surface-soft)] p-4">
                <p className="mb-3 text-xs leading-relaxed">
                  Replace this board with the three sample tasks? Your current
                  tasks will be removed.
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={resetSample}
                    className="rounded-lg bg-[var(--text)] px-3 py-2 text-xs text-[var(--bg)]"
                  >
                    Replace with samples
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="rounded-lg border border-[var(--line)] px-3 py-2 text-xs"
                  >
                    Keep my board
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="min-w-0">
          <div className="mb-5 rounded-xl border border-[var(--line)] bg-[var(--surface-soft)] p-4">
            <div className="mb-3 flex items-center justify-between text-xs">
              <span className="font-medium">Small steps, visible progress</span>
              <span className="text-[var(--muted)]" role="status">
                {completed} / {tasks.length} complete
              </span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-[var(--line)]"
              role="progressbar"
              aria-label="Task completion"
              aria-valuenow={percentage}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-[var(--green)] transition-[width]"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div
              className="flex gap-1 rounded-lg border border-[var(--line)] p-1"
              role="group"
              aria-label="Filter tasks"
            >
              {(
                [
                  ["all", "All"],
                  ["active", "Active"],
                  ["done", "Done"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilter(value)}
                  aria-pressed={filter === value}
                  className={`min-h-9 rounded-md px-3 text-xs ${filter === value ? "bg-[var(--text)] text-[var(--bg)]" : "text-[var(--muted)]"}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <label className="relative max-w-full">
              <span className="sr-only">Search your tasks</span>
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Find a task"
                maxLength={100}
                type="search"
                className="w-44 rounded-lg border border-[var(--line)] bg-[var(--surface)] py-2.5 pl-8 pr-3 text-xs"
              />
            </label>
          </div>
          <ul className="space-y-3">
            {visible.map((task) => (
              <li
                key={task.id}
                className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4"
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() =>
                      setTasks((current) =>
                        current.map((item) =>
                          item.id === task.id
                            ? { ...item, completed: !item.completed }
                            : item,
                        ),
                      )
                    }
                    aria-label={`Mark “${task.title}” ${task.completed ? "active" : "complete"}`}
                    className="mt-1 h-4 w-4 shrink-0 accent-[var(--green)]"
                  />
                  <div className="min-w-0 flex-1">
                    <h4
                      className={`mb-1 break-words text-sm font-semibold ${task.completed ? "text-[var(--muted)] line-through" : ""}`}
                    >
                      {task.title}
                    </h4>
                    {task.detail && (
                      <p className="mb-3 whitespace-pre-wrap break-words text-xs leading-relaxed text-[var(--muted)]">
                        {task.detail}
                      </p>
                    )}
                    <span className="inline-flex rounded border border-[var(--line)] px-2 py-1 text-[10px] capitalize text-[var(--muted)]">
                      {task.priority} priority
                    </span>
                  </div>
                  <div className="flex shrink-0 flex-col gap-1">
                    <button
                      type="button"
                      aria-label={`Edit “${task.title}”`}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
                      onClick={() => editTask(task)}
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete “${task.title}”`}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
                      onClick={() => {
                        setTasks((current) =>
                          current.filter((item) => item.id !== task.id),
                        );
                        if (editing === task.id) clearEditor();
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {!visible.length && (
            <div className="rounded-xl border border-dashed border-[var(--line)] p-8 text-center">
              <ClipboardList
                size={26}
                className="mx-auto mb-3 text-[var(--muted)]"
              />
              <p className="mb-1 text-sm font-medium">
                {tasks.length
                  ? "No tasks match this view."
                  : "Your board is a clean slate."}
              </p>
              <p className="mb-0 text-xs leading-relaxed text-[var(--muted)]">
                {tasks.length
                  ? "Try a different filter or search."
                  : "Add a small first step. That’s how good projects start."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
