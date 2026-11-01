/** Central GA4 event contract. Never include form content, code, or complete URLs. */
export type AnalyticsValue = string | number | boolean;
export type AnalyticsParameters = Record<string, AnalyticsValue | null | undefined>;

const EVENT_NAME = /^[a-z][a-z0-9_]{0,39}$/;
const PARAM_NAME = /^[a-z][a-z0-9_]{0,39}$/;
const MEASUREMENT_ID = /^G-[A-Z0-9]{6,30}$/i;
export const ANALYTICS_OPT_OUT_KEY = "mbiopeter:analytics-disabled";

/** Keep the existing NEXT_PUBLIC_GA_ID name compatible with previously deployed sites. */
export function getAnalyticsId(): string | null {
  const value = (process.env.NEXT_PUBLIC_GA_ID || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "").trim();
  if (!MEASUREMENT_ID.test(value)) return null;
  if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_GA_TRACK_LOCAL !== "true") return null;
  return value.toUpperCase();
}

export function isValidAnalyticsId(id: string): boolean {
  return MEASUREMENT_ID.test(id.trim());
}

/** Consent/opt-out is applied before the Google tag loads in app/layout.tsx. */
export function analyticsOptedOut(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(ANALYTICS_OPT_OUT_KEY) === "true";
  } catch {
    return false;
  }
}

export function setAnalyticsOptOut(disabled: boolean): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(ANALYTICS_OPT_OUT_KEY, String(disabled));
    const id = getAnalyticsId();
    if (id) (window as Window & Record<string, unknown>)[`ga-disable-${id}`] = disabled;
    return true;
  } catch {
    return false;
  }
}

/**
 * Only developer-controlled event names and low-cardinality, non-PII values
 * should enter this function. The global tracker never reads input values.
 */
export function trackEvent(eventName: string, params: AnalyticsParameters = {}): void {
  if (typeof window === "undefined" || !getAnalyticsId() || analyticsOptedOut() || !EVENT_NAME.test(eventName)) return;
  const safe: Record<string, AnalyticsValue> = {};
  for (const [key, value] of Object.entries(params)) {
    if (!PARAM_NAME.test(key) || value == null) continue;
    if (typeof value === "string") safe[key] = value.slice(0, 100);
    else if (typeof value === "number" && Number.isFinite(value)) safe[key] = value;
    else if (typeof value === "boolean") safe[key] = value;
  }
  // Google tag API: gtag("event", name, params). Queue if the tag has not loaded yet.
  const globalWindow = window as Window & { gtag?: (...args: unknown[]) => void; dataLayer?: unknown[] };
  if (typeof globalWindow.gtag === "function") {
    globalWindow.gtag("event", eventName, safe);
  } else {
    if (!Array.isArray(globalWindow.dataLayer)) globalWindow.dataLayer = [];
    const args = (function (..._values: unknown[]) { return arguments; })("event", eventName, safe);
    globalWindow.dataLayer.push(args);
  }
}

/** Internal URLs may be reported by pathname only. Never send query or hash. */
export function classifyLink(href: string, origin: string): {
  kind: "internal" | "outbound" | "download" | "other";
  path?: string;
  domain?: string;
} {
  if (!href.trim() || /^(?:mailto:|tel:|sms:|javascript:|data:)/i.test(href.trim())) return { kind: "other" };
  try {
    const url = new URL(href, origin);
    if (!/^https?:$/.test(url.protocol)) return { kind: "other" };
    if (url.origin !== origin) return { kind: "outbound", domain: url.hostname.slice(0, 100) };
    const path = url.pathname.slice(0, 100);
    if (/\.(?:pdf|csv|zip|docx?|xlsx?|pptx?|txt|json|png|jpe?g|webp)$/i.test(path)) {
      return { kind: "download", path };
    }
    return { kind: "internal", path };
  } catch {
    return { kind: "other" };
  }
}

export const SCROLL_MILESTONES = [25, 50, 75, 90, 100] as const;

export function reachedScrollMilestones(depth: number, alreadySent: ReadonlySet<number>): number[] {
  if (!Number.isFinite(depth)) return [];
  return SCROLL_MILESTONES.filter((step) => depth >= step && !alreadySent.has(step));
}

export function safeAnalyticsLabel(value: string | undefined | null): string | undefined {
  if (!value) return undefined;
  const label = value.trim();
  // Only use explicitly authored labels, never textContent or live form values.
  return /^[a-zA-Z0-9 _./-]{1,80}$/.test(label) ? label : undefined;
}
