"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, ChevronDown, Copy, MessageCircle } from "lucide-react";
import { useToast } from "@/context/toast-context";
import { services } from "@/data/services";
import { getWhatsAppUrl } from "@/lib/links";

const serviceOptions = [
  ...services.map(({ slug, title }) => ({ slug, title })),
  { slug: "something-else", title: "Something else / not sure yet" },
];

type FieldName =
  "service" | "name" | "project" | "budget" | "timeline" | "message";
type FieldErrors = Partial<Record<FieldName, string>>;

const fieldClass =
  "w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3.5 text-sm text-[var(--text)] transition-colors placeholder:text-[var(--muted)] hover:border-[var(--muted)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--green)]";

export function ContactForm() {
  const id = useId();
  const [service, setService] = useState("");
  const [name, setName] = useState("");
  const [project, setProject] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const previewRef = useRef<HTMLTextAreaElement>(null);
  const { notify } = useToast();

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get(
      "service",
    );
    if (
      requested &&
      serviceOptions.some((option) => option.slug === requested)
    ) {
      setService(requested);
    }
  }, []);

  function clearError(field: FieldName) {
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function buildDraft() {
    const selectedService = serviceOptions.find(
      (option) => option.slug === service,
    );
    return [
      "Hi Alexender! I'd like to discuss a project.",
      "",
      ...(name.trim() ? [`Name: ${name.trim()}`] : []),
      `Service: ${selectedService?.title ?? "Not selected yet"}`,
      ...(project.trim() ? [`Project: ${project.trim()}`] : []),
      ...(budget.trim() ? [`Budget: ${budget.trim()}`] : []),
      ...(timeline.trim() ? [`Timeline: ${timeline.trim()}`] : []),
      "",
      "Project details:",
      message.trim(),
      "",
      "I found you through your website.",
    ].join("\n");
  }

  function prepareDraft(): string | null {
    const selectedService = serviceOptions.find(
      (option) => option.slug === service,
    );
    const values = {
      name: name.trim(),
      project: project.trim(),
      budget: budget.trim(),
      timeline: timeline.trim(),
      message: message.trim(),
    };
    const nextErrors: FieldErrors = {};

    if (!selectedService)
      nextErrors.service = "Please choose a service so I can help.";
    if (values.name.length > 80)
      nextErrors.name = "Please keep your name to 80 characters or fewer.";
    if (values.project.length > 120)
      nextErrors.project =
        "Please keep the project name to 120 characters or fewer.";
    if (values.budget.length > 80)
      nextErrors.budget =
        "Please keep the budget note to 80 characters or fewer.";
    if (values.timeline.length > 80)
      nextErrors.timeline =
        "Please keep the timeline note to 80 characters or fewer.";
    if (values.message.length < 15)
      nextErrors.message = "Tell me a little more—at least 15 characters.";
    else if (values.message.length > 2000)
      nextErrors.message =
        "Please keep your message to 2,000 characters or fewer.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      requestAnimationFrame(() => {
        formRef.current
          ?.querySelector<HTMLElement>('[aria-invalid="true"]')
          ?.focus();
      });
      return null;
    }

    return buildDraft();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const draft = prepareDraft();
    if (!draft) return;
    const url = getWhatsAppUrl(draft);
    if (!url) {
      notify(
        "WhatsApp enquiries will be available soon. Please check back shortly.",
      );
      return;
    }
    // This opens a draft. The visitor still decides whether to send it.
    window.location.assign(url);
  }

  async function copyDraft() {
    const draft = prepareDraft();
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(draft);
      notify("Message copied. Paste it into your WhatsApp chat.", "success");
    } catch {
      setPreviewOpen(true);
      requestAnimationFrame(() => {
        previewRef.current?.focus();
        previewRef.current?.select();
      });
      notify("Select and copy the message preview, then paste it in WhatsApp.");
    }
  }

  const optionalFields = [
    {
      field: "name" as const,
      label: "Your name",
      value: name,
      setValue: setName,
      maxLength: 80,
      placeholder: "What should I call you?",
      autoComplete: "name",
    },
    {
      field: "project" as const,
      label: "Project or business name",
      value: project,
      setValue: setProject,
      maxLength: 120,
      placeholder: "A name for your idea",
      autoComplete: "off",
    },
    {
      field: "budget" as const,
      label: "Budget",
      value: budget,
      setValue: setBudget,
      maxLength: 80,
      placeholder: "A range, or let’s discuss",
      autoComplete: "off",
    },
    {
      field: "timeline" as const,
      label: "Timeline",
      value: timeline,
      setValue: setTimeline,
      maxLength: 80,
      placeholder: "A target date, or flexible",
      autoComplete: "off",
    },
  ];

  return (
    <form
      ref={formRef}
      className="contact-form space-y-5"
      onSubmit={handleSubmit}
      noValidate
    >
      <div>
        <label
          className="mb-2 block text-sm font-semibold text-[var(--text)]"
          htmlFor={`${id}-service`}
        >
          What can I help with?
        </label>
        <div className="relative">
          <select
            id={`${id}-service`}
            name="service"
            value={service}
            onChange={(event) => {
              setService(event.target.value);
              clearError("service");
            }}
            className={`${fieldClass} appearance-none pr-12`}
            required
            aria-invalid={Boolean(errors.service)}
            aria-describedby={
              errors.service ? `${id}-service-error` : undefined
            }
          >
            <option value="" disabled>
              Choose a service
            </option>
            {serviceOptions.map((option) => (
              <option key={option.slug} value={option.slug}>
                {option.title}
              </option>
            ))}
          </select>
          <ChevronDown
            size={17}
            className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[var(--muted)]"
            aria-hidden="true"
          />
        </div>
        {errors.service && (
          <p
            id={`${id}-service-error`}
            className="mt-2 text-xs font-medium text-[var(--text)]"
            role="alert"
          >
            {errors.service}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {optionalFields.map(
          ({
            field,
            label,
            value,
            setValue,
            maxLength,
            placeholder,
            autoComplete,
          }) => (
            <div key={field}>
              <label
                className="mb-2 block text-sm font-semibold text-[var(--text)]"
                htmlFor={`${id}-${field}`}
              >
                {label}{" "}
                <span className="font-normal text-[var(--muted)]">
                  (optional)
                </span>
              </label>
              <input
                id={`${id}-${field}`}
                name={field}
                type="text"
                autoComplete={autoComplete}
                value={value}
                onChange={(event) => {
                  setValue(event.target.value);
                  clearError(field);
                }}
                maxLength={maxLength}
                placeholder={placeholder}
                className={fieldClass}
                aria-invalid={Boolean(errors[field])}
                aria-describedby={
                  errors[field] ? `${id}-${field}-error` : undefined
                }
              />
              {errors[field] && (
                <p
                  id={`${id}-${field}-error`}
                  className="mt-2 text-xs font-medium text-[var(--text)]"
                  role="alert"
                >
                  {errors[field]}
                </p>
              )}
            </div>
          ),
        )}
      </div>

      <div>
        <label
          className="mb-2 block text-sm font-semibold text-[var(--text)]"
          htmlFor={`${id}-message`}
        >
          Tell me about your project
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          value={message}
          onChange={(event) => {
            setMessage(event.target.value);
            if (event.target.value.trim().length >= 15) clearError("message");
          }}
          minLength={15}
          maxLength={2000}
          required
          rows={5}
          placeholder="What would you like to build, fix, or make easier? A few sentences are enough to start."
          className={`${fieldClass} min-h-36 resize-y leading-relaxed`}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={`${id}-message-hint${errors.message ? ` ${id}-message-error` : ""}`}
        />
        <div
          id={`${id}-message-hint`}
          className="mt-2 flex items-center justify-between gap-3 text-xs text-[var(--muted)]"
        >
          <span>At least 15 characters</span>
          <span>{message.length.toLocaleString("en-US")} / 2,000</span>
        </div>
        {errors.message && (
          <p
            id={`${id}-message-error`}
            className="mt-2 text-xs font-medium text-[var(--text)]"
            role="alert"
          >
            {errors.message}
          </p>
        )}
      </div>

      <details
        open={previewOpen}
        onToggle={(event) => setPreviewOpen(event.currentTarget.open)}
        className="rounded-xl border border-[var(--line)] bg-[var(--surface)]"
      >
        <summary className="cursor-pointer rounded-xl px-4 py-3 text-sm font-medium text-[var(--text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--green)]">
          Preview or copy your message
        </summary>
        <div className="space-y-3 px-4 pb-4">
          <label htmlFor={`${id}-preview`} className="sr-only">
            Your WhatsApp message preview
          </label>
          <textarea
            ref={previewRef}
            id={`${id}-preview`}
            value={buildDraft()}
            readOnly
            rows={8}
            className={`${fieldClass} resize-y font-mono text-xs leading-relaxed`}
          />
          <button
            type="button"
            onClick={copyDraft}
            className="button button-quiet w-full"
          >
            <Copy size={16} aria-hidden="true" />
            Copy message
          </button>
          <p className="text-xs leading-relaxed text-[var(--muted)]">
            If WhatsApp opens without your draft, copy it here and paste it into
            the chat.
          </p>
        </div>
      </details>

      <button type="submit" className="button button-accent w-full">
        <MessageCircle size={18} aria-hidden="true" />
        Continue on WhatsApp
        <ArrowUpRight size={18} aria-hidden="true" />
      </button>
      <p className="text-center text-xs leading-relaxed text-[var(--muted)]">
        This opens a WhatsApp draft. You choose when to send it.
      </p>
    </form>
  );
}
