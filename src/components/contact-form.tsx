"use client";

import { Suspense, useId, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight, ChevronDown, Copy, Mail, MessageCircle, Trash2 } from "lucide-react";
import { useToast } from "@/context/toast-context";
import { services } from "@/data/services";
import { getContactEmail, getEmailDraftUrl, getWhatsAppUrl } from "@/lib/links";
import { useContactDraft } from "@/hooks/use-contact-draft";
import {
  buildContactMessage,
  hasContactBrief,
  validateContactBrief,
  type ContactField,
  type ContactErrors,
} from "@/lib/contact-draft";

const serviceOptions = [
  ...services.map(({ slug, title }) => ({ slug, title })),
  { slug: "something-else", title: "Something else / not sure yet" },
];
const serviceSlugs = serviceOptions.map((option) => option.slug);

const fieldClass =
  "w-full rounded-xl border border-(--line) bg-(--surface) px-4 py-3.5 text-sm text-(--text) transition-colors placeholder:text-(--muted) hover:border-(--muted) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--green)";

function ContactFormFields({ requestedService }: { requestedService: string | null }) {
  const id = useId();
  const { brief, updateField, clearDraft, ready, storageNote } = useContactDraft(serviceSlugs, requestedService);
  const { service, name, project, budget, timeline, message } = brief;
  const [errors, setErrors] = useState<ContactErrors>({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const previewRef = useRef<HTMLTextAreaElement>(null);
  const { notify } = useToast();
  const emailAvailable = Boolean(getContactEmail());
  const whatsappAvailable = Boolean(getWhatsAppUrl());

  function clearError(field: ContactField) {
    setErrors((current) => ({ ...current, [field]: undefined }));
    setConfirmClear(false);
  }

  function buildDraft() {
    const selectedService = serviceOptions.find(
      (option) => option.slug === service,
    );
    return buildContactMessage(brief, selectedService?.title);
  }

  function prepareDraft(): string | null {
    const nextErrors = validateContactBrief(brief, serviceSlugs);

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
    if (!ready) return;
    if (!whatsappAvailable) {
      if (emailAvailable) openEmailDraft();
      else void copyDraft();
      return;
    }
    const draft = prepareDraft();
    if (!draft) return;
    const url = getWhatsAppUrl(draft);
    if (!url) {
      notify(
        "WhatsApp is unavailable right now. You can copy your project brief below.",
      );
      return;
    }
    // This opens a draft. The visitor still decides whether to send it.
    window.location.assign(url);
  }

  function openEmailDraft() {
    const draft = prepareDraft();
    if (!draft) return;
    const subject = project.trim()
      ? `Project enquiry — ${project.trim()}`
      : "Project enquiry from your website";
    const url = getEmailDraftUrl(draft, subject);
    if (url) window.location.assign(url);
  }

  function clearBrief() {
    const cleared = clearDraft();
    setErrors({});
    setConfirmClear(false);
    notify(
      cleared
        ? "Brief cleared from this tab."
        : "Fields cleared. Your browser blocked access to the saved draft.",
      cleared ? "success" : "info",
    );
    requestAnimationFrame(() => formRef.current?.querySelector("select")?.focus());
  }

  async function copyDraft() {
    const draft = prepareDraft();
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(draft);
      notify("Brief copied. Paste it into your message.", "success");
    } catch {
      setPreviewOpen(true);
      requestAnimationFrame(() => {
        previewRef.current?.focus();
        previewRef.current?.select();
      });
      notify("Select and copy the preview, then paste it into your message.");
    }
  }

  const optionalFields = [
    {
      field: "name" as const,
      label: "Your name",
      value: name,
      setValue: (value: string) => updateField("name", value),
      maxLength: 80,
      placeholder: "What should I call you?",
      autoComplete: "name",
    },
    {
      field: "project" as const,
      label: "Project or business name",
      value: project,
      setValue: (value: string) => updateField("project", value),
      maxLength: 120,
      placeholder: "A name for your idea",
      autoComplete: "off",
    },
    {
      field: "budget" as const,
      label: "Budget",
      value: budget,
      setValue: (value: string) => updateField("budget", value),
      maxLength: 80,
      placeholder: "A range, or let’s discuss",
      autoComplete: "off",
    },
    {
      field: "timeline" as const,
      label: "Timeline",
      value: timeline,
      setValue: (value: string) => updateField("timeline", value),
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
      aria-busy={!ready}
      noValidate>

      <div>

        <label
          className="mb-2 block text-sm font-semibold text-(--text)"
          htmlFor={`${id}-service`}>
          What can I help with?
        </label>
        <div className="relative">

          <select
            id={`${id}-service`}
            name="service"
            value={service}
            disabled={!ready}
            onChange={(event) => {
              updateField("service", event.target.value);
              clearError("service");
            }}
            className={`${fieldClass} appearance-none pr-12`}
            required
            aria-invalid={Boolean(errors.service)}
            aria-describedby={
              errors.service ? `${id}-service-error` : undefined
            }>
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
            className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-(--muted)"
            aria-hidden="true"/>

        </div>
        {errors.service && (
          <p
            id={`${id}-service-error`}
            className="mt-2 text-xs font-medium text-(--text)"
            role="alert">
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
                className="mb-2 block text-sm font-semibold text-(--text)"
                htmlFor={`${id}-${field}`}>

                {label}{" "}
                <span className="font-normal text-(--muted)">
                  (optional)
                </span>

              </label>
              <input
                id={`${id}-${field}`}
                name={field}
                type="text"
                autoComplete={autoComplete}
                value={value}
                disabled={!ready}
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
                }/>
              {errors[field] && (
                <p
                  id={`${id}-${field}-error`}
                  className="mt-2 text-xs font-medium text-(--text)"
                  role="alert">
                  {errors[field]}
                </p>
              )}
            </div>
          ),
        )}
      </div>
      <div>

        <label
          className="mb-2 block text-sm font-semibold text-(--text)"
          htmlFor={`${id}-message`}>
          Tell me about your project
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          value={message}
          disabled={!ready}
          onChange={(event) => {
            updateField("message", event.target.value);
            setConfirmClear(false);
            if (event.target.value.trim().length >= 15) clearError("message");
          }}
          minLength={15}
          maxLength={2000}
          required
          rows={5}
          placeholder="What would you like to build, fix, or make easier? A few sentences are enough to start."
          className={`${fieldClass} min-h-36 resize-y leading-relaxed`}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={`${id}-message-hint${errors.message ? ` ${id}-message-error` : ""}`}/>
        <div
          id={`${id}-message-hint`}
          className="mt-2 flex items-center justify-between gap-3 text-xs text-(--muted)">
          <span>At least 15 characters</span>
          <span>{message.length.toLocaleString("en-US")} / 2,000</span>

        </div>
        {errors.message && (
          <p
            id={`${id}-message-error`}
            className="mt-2 text-xs font-medium text-(--text)"
            role="alert">
            {errors.message}
          </p>
        )}
      </div>
      <div className="rounded-xl bg-(--surface-soft) px-4 py-3">

        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">

          <p className="mb-0 text-xs leading-6 text-(--muted)" role="status">
            {storageNote}
          </p>
          {hasContactBrief(brief) && !confirmClear && (
            <button
              type="button"
              className="inline-flex min-h-10 items-center gap-2 text-xs font-medium text-(--muted) hover:text-(--text)"
              onClick={() => setConfirmClear(true)}
              disabled={!ready}>
              <Trash2 size={14} aria-hidden="true" />
              Clear draft
            </button>
          )}
        </div>
        {confirmClear && (
          <div className="mt-3 border-t border-(--line) pt-3">

            <p className="mb-2 text-xs leading-6 text-(--text)">
              Clear all fields and this tab’s saved brief?
            </p>
            <div className="flex flex-wrap gap-2">

              <button type="button" className="button button-outline" onClick={clearBrief}>
                Clear brief
              </button>
              <button type="button" className="button button-quiet" onClick={() => setConfirmClear(false)}>
                Keep editing
              </button>

            </div>

          </div>
        )}
      </div>
      <details
        open={previewOpen}
        onToggle={(event) => setPreviewOpen(event.currentTarget.open)}
        className="rounded-xl border border-(--line) bg-(--surface)">
        <summary className="cursor-pointer rounded-xl px-4 py-3 text-sm font-medium text-(--text) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--green)">
          Preview or copy your message
        </summary>
        <div className="space-y-3 px-4 pb-4">

          <label htmlFor={`${id}-preview`} className="sr-only">
            Your project brief preview
          </label>
          <textarea
            ref={previewRef}
            id={`${id}-preview`}
            value={buildDraft()}
            readOnly
            rows={8}
            className={`${fieldClass} resize-y font-mono text-xs leading-relaxed`}/>
          <button
            type="button"
            onClick={copyDraft}
            className="button button-quiet w-full">
            <Copy size={16} aria-hidden="true" />
            Copy message
          </button>
          <p className="text-xs leading-relaxed text-(--muted)">
            If your messaging or email app opens without the brief, copy it here
            and paste it into your draft.
          </p>

        </div>
        
      </details>
      <button type="submit" className="button button-accent w-full" disabled={!ready}>

        {whatsappAvailable ? <MessageCircle size={18} aria-hidden="true" /> : emailAvailable ? <Mail size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
        {whatsappAvailable ? "Continue on WhatsApp" : emailAvailable ? "Open email draft" : "Copy project brief"}
        <ArrowUpRight size={18} aria-hidden="true" />

      </button>
      {(whatsappAvailable || emailAvailable) && (
        <div className={`grid gap-3 ${whatsappAvailable && emailAvailable ? "sm:grid-cols-2" : ""}`}>

          {whatsappAvailable && emailAvailable && (
            <button type="button" className="button button-outline w-full" onClick={openEmailDraft} disabled={!ready}>

              <Mail size={17} aria-hidden="true" />
              Use email instead

            </button>
          )}
          <button type="button" className="button button-quiet w-full" onClick={copyDraft} disabled={!ready}>

            <Copy size={17} aria-hidden="true" />
            Copy project brief
          </button>

        </div>
      )}
      <p className="text-center text-xs leading-relaxed text-(--muted)">
        {whatsappAvailable || emailAvailable
          ? "You review and send the draft in your chosen app. Opening it does not send your enquiry."
          : "Copy your brief and send it through your preferred contact channel."}
      </p>
      
    </form>
  );
}

function ContactFormWithQuery() {
  const searchParams = useSearchParams();
  return <ContactFormFields requestedService={searchParams.get("service") ?? ""} />;
}

export function ContactForm() {
  return (
    <Suspense fallback={<ContactFormFields requestedService={null} />}>
      <ContactFormWithQuery />
    </Suspense>
  );
}
