import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  analyticsOptedOut,
  classifyLink,
  isValidAnalyticsId,
  reachedScrollMilestones,
  safeAnalyticsLabel,
  trackEvent,
  setAnalyticsOptOut,
} from "../src/lib/analytics.ts";

const read = (path) => readFileSync(resolve(path), "utf8");

test("GA4 measurement ID is validated, not a secret or arbitrary script input", () => {
  assert.equal(isValidAnalyticsId("G-TEST12345"), true);
  assert.equal(isValidAnalyticsId("GA-12345"), false);
  assert.equal(isValidAnalyticsId("G-<script>"), false);
});

test("scroll milestone tracking is finite and one-shot per threshold", () => {
  assert.deepEqual(reachedScrollMilestones(24, new Set()), []);
  assert.deepEqual(reachedScrollMilestones(51, new Set()), [25, 50]);
  assert.deepEqual(reachedScrollMilestones(98, new Set([25, 50, 75])), [90]);
  assert.deepEqual(reachedScrollMilestones(100, new Set([25, 50, 75, 90])), [100]);
  assert.deepEqual(reachedScrollMilestones(Number.NaN, new Set()), []);
});

test("internal click URLs never expose search parameters or fragment text", () => {
  const link = classifyLink("https://mbiopeter.co.ke/hire/?message=private&email=x%40y.com#secret", "https://mbiopeter.co.ke");
  assert.deepEqual(link, { kind: "internal", path: "/hire/" });
  assert.deepEqual(classifyLink("/downloads/report.csv?token=123", "https://mbiopeter.co.ke"), { kind: "download", path: "/downloads/report.csv" });
  assert.deepEqual(classifyLink("https://wa.me/254712345678?text=private", "https://mbiopeter.co.ke"), { kind: "outbound", domain: "wa.me" });
  assert.deepEqual(classifyLink("mailto:test@example.com", "https://mbiopeter.co.ke"), { kind: "other" });
});

test("unknown button content is not turned into a tracking label", () => {
  assert.equal(safeAnalyticsLabel("hero_launch"), "hero_launch");
  assert.equal(safeAnalyticsLabel("my@email.com"), undefined);
  assert.equal(safeAnalyticsLabel("<script>alert(1)</script>"), undefined);
});

test("server-side event sending is safe and disabled without a browser", () => {
  assert.equal(analyticsOptedOut(), false);
  assert.doesNotThrow(() => trackEvent("ui_click", { page_path: "/" }));
});

test("events use GA4 event protocol and opt-out prevents sending", () => {
  const oldWindow = globalThis.window;
  const oldId = process.env.NEXT_PUBLIC_GA_ID;
  const oldNodeEnv = process.env.NODE_ENV;
  const calls = [];
  let stored = null;
  try {
    process.env.NEXT_PUBLIC_GA_ID = "G-VALID1234";
    process.env.NODE_ENV = "production";
    globalThis.window = {
      gtag: (...args) => calls.push(args),
      localStorage: { getItem: () => stored, setItem: (_key, val) => { stored = val; } },
    };
    trackEvent("ui_click", { page_path: "/hire/", numeric_count: 2, invalid: Number.NaN, "bad-param": "ignored" });
    assert.equal(calls.length, 1);
    assert.deepEqual(calls[0], ["event", "ui_click", { page_path: "/hire/", numeric_count: 2 }]);
    assert.equal(setAnalyticsOptOut(true), true);
    trackEvent("ui_click", { page_path: "/" });
    assert.equal(calls.length, 1, "opt-out must stop events");
    assert.equal(setAnalyticsOptOut(false), true);
    trackEvent("ui_click", { page_path: "/" });
    assert.equal(calls.length, 2);
  } finally {
    if (oldWindow === undefined) delete globalThis.window;
    else globalThis.window = oldWindow;
    if (oldId === undefined) delete process.env.NEXT_PUBLIC_GA_ID;
    else process.env.NEXT_PUBLIC_GA_ID = oldId;
    if (oldNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = oldNodeEnv;
  }
});

test("early events are queued for Google tag when the network script is delayed", () => {
  const oldWindow = globalThis.window;
  const oldId = process.env.NEXT_PUBLIC_GA_ID;
  const oldNodeEnv = process.env.NODE_ENV;
  try {
    process.env.NEXT_PUBLIC_GA_ID = "G-VALID1234";
    process.env.NODE_ENV = "production";
    globalThis.window = { dataLayer: [], localStorage: { getItem: () => null } };
    trackEvent("route_view", { page_path: "/" });
    assert.equal(globalThis.window.dataLayer.length, 1);
    const pending = globalThis.window.dataLayer[0];
    assert.equal(pending[0], "event");
    assert.equal(pending[1], "route_view");
  } finally {
    if (oldWindow === undefined) delete globalThis.window;
    else globalThis.window = oldWindow;
    if (oldId === undefined) delete process.env.NEXT_PUBLIC_GA_ID;
    else process.env.NEXT_PUBLIC_GA_ID = oldId;
    if (oldNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = oldNodeEnv;
  }
});

test("global tracker includes SPA routing, event delegation, scroll, section views and forms", () => {
  const tracker = read("src/components/analytics-tracker.tsx");
  for (const event of ["route_view", "ui_click", "ui_change", "scroll_depth", "section_view", "form_start", "form_submit_intent", "outbound_link", "resource_download", "page_engagement"]) {
    assert.ok(tracker.includes(`"${event}"`), `${event} not connected`);
  }
  assert.match(tracker, /usePathname\(\)/);
  assert.match(tracker, /IntersectionObserver/);
  assert.match(tracker, /querySelectorAll.*section\[id\]/);
  assert.doesNotMatch(tracker, /\.value\b|\.textContent\b|\.innerText\b/);
  assert.match(read("src/app/layout.tsx"), /<GoogleAnalytics gaId=\{gaId\}/);
  assert.match(read("src/app/layout.tsx"), /<AnalyticsTracker\s*\/>/);
});

test("specialized funnels include actual project, code, quiz and contact actions", () => {
  for (const [file, event] of [
    ["src/components/contact-form.tsx", "contact_channel_open"],
    ["src/components/training-playground.tsx", "playground_run_complete"],
    ["src/components/theory-quiz.tsx", "quiz_complete"],
    ["src/components/projects/projects-explorer.tsx", "project_filter"],
    ["src/components/mbiotrade-tour.tsx", "mbiotraders_tour_tab"],
  ]) assert.match(read(file), new RegExp(event));
});

test("SEO includes explicit mbioTraders indexing, structured data, robots and Search Console support", () => {
  const sitemap = read("src/app/sitemap.ts");
  assert.match(sitemap, /"\/mbiotrade\/"/);
  assert.match(sitemap, /new Set\(routes\)/);
  assert.match(read("src/app/robots.ts"), /sitemap:/);
  assert.match(read("src/app/mbiotrade/page.tsx"), /SoftwareApplication/);
  assert.match(read("src/app/mbiotrade/page.tsx"), /BreadcrumbList/);
  assert.match(read("src/app/mbiotrade/page.tsx"), /FAQPage/);
  assert.match(read("src/app/layout.tsx"), /NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION/);
});

test("product page advertises existing v34 features and retains a real downloadable guide", () => {
  const page = read("src/app/mbiotrade/page.tsx");
  for (const term of ["BTC/USD", "60%", "5m", "15m", "30m", "1H", "4H", "1D", "Kraken", "Install App", "2R", "CSV"]) {
    assert.ok(page.includes(term), `missing product feature: ${term}`);
  }
  assert.ok(existsSync(resolve("public/downloads/mbiotraders-signal-guide.pdf")));
  assert.match(page, /href="\/downloads\/mbiotraders-signal-guide\.pdf"/);
});

test("privacy and opt-out are present without changing core design files", () => {
  assert.match(read("src/app/privacy/page.tsx"), /AnalyticsPreferences/);
  assert.match(read("src/lib/analytics.ts"), /ANALYTICS_OPT_OUT_KEY/);
  assert.match(read("src/app/layout.tsx"), /optOutInitScript/);
  assert.match(read("src/app/layout.tsx"), /styles\/mbiotrade\.css/);
});
