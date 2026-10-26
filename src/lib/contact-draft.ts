export const CONTACT_DRAFT_KEY = "alexender-contact:brief:v1";
const MAX_STORED_CHARS = 20_000;

export const CONTACT_LIMITS = {
  service: 80,
  name: 80,
  project: 120,
  budget: 80,
  timeline: 80,
  message: 2000,
} as const;

export type ContactField = keyof typeof CONTACT_LIMITS;
export type ContactBrief = Record<ContactField, string>;
export type ContactErrors = Partial<Record<ContactField, string>>;

export function emptyContactBrief(): ContactBrief {
  return { service: "", name: "", project: "", budget: "", timeline: "", message: "" };
}

export function hasContactBrief(brief: ContactBrief): boolean {
  return Object.values(brief).some((value) => value.length > 0);
}

export function readContactDraft(
  raw: string | null,
  validServices: readonly string[],
  requestedService = "",
): ContactBrief | null {
  if (!raw || raw.length > MAX_STORED_CHARS) return null;
  try {
    const stored: unknown = JSON.parse(raw);
    if (!stored || typeof stored !== "object" || Array.isArray(stored)) return null;
    const record = stored as Record<string, unknown>;
    if (record.version !== 1 || !record.fields || typeof record.fields !== "object" || Array.isArray(record.fields)) return null;
    const values = record.fields as Record<string, unknown>;
    const result = emptyContactBrief();
    for (const field of Object.keys(CONTACT_LIMITS) as ContactField[]) {
      const value = values[field];
      if (typeof value !== "string" || value.length > CONTACT_LIMITS[field] || value.includes("\0")) return null;
      result[field] = value;
    }
    if (result.service && !validServices.includes(result.service)) result.service = "";
    if (validServices.includes(requestedService) && record.serviceHint !== requestedService) {
      result.service = requestedService;
    }
    return result;
  } catch {
    return null;
  }
}

export function serializeContactDraft(brief: ContactBrief, serviceHint = ""): string {
  return JSON.stringify({ version: 1, fields: brief, serviceHint });
}

export function buildContactMessage(brief: ContactBrief, serviceTitle?: string): string {
  return [
    "Hi Mbiopeter! I'd like to discuss a project.",
    "",
    ...(brief.name.trim() ? [`Name: ${brief.name.trim()}`] : []),
    `Service: ${serviceTitle ?? "Not selected yet"}`,
    ...(brief.project.trim() ? [`Project: ${brief.project.trim()}`] : []),
    ...(brief.budget.trim() ? [`Budget: ${brief.budget.trim()}`] : []),
    ...(brief.timeline.trim() ? [`Timeline: ${brief.timeline.trim()}`] : []),
    "",
    "Project details:",
    brief.message.trim(),
    "",
    "I found you through your website.",
  ].join("\n");
}

export function validateContactBrief(
  brief: ContactBrief,
  validServices: readonly string[],
): ContactErrors {
  const errors: ContactErrors = {};
  if (!validServices.includes(brief.service)) errors.service = "Please choose a service so I can help.";
  const labels: Record<Exclude<ContactField, "service" | "message">, string> = {
    name: "your name",
    project: "the project name",
    budget: "the budget note",
    timeline: "the timeline note",
  };
  for (const field of Object.keys(labels) as (keyof typeof labels)[]) {
    if (brief[field].trim().length > CONTACT_LIMITS[field]) {
      errors[field] = `Please keep ${labels[field]} to ${CONTACT_LIMITS[field]} characters or fewer.`;
    }
  }
  if (brief.message.trim().length < 15) errors.message = "Tell me a little more—at least 15 characters.";
  else if (brief.message.trim().length > CONTACT_LIMITS.message) errors.message = "Please keep your message to 2,000 characters or fewer.";
  return errors;
}
