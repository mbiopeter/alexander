import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
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
  const layout = read("src/app/layout.tsx");
  const browserBoot = read("src/lib/browser-boot.ts");
  assert.match(browserBoot, /mbiopeter-google-tag/);
  assert.match(browserBoot, /googletagmanager\.com\/gtag\/js/);
  assert.match(browserBoot, /send_page_view: false/);
  assert.match(tracker, /trackEvent\("page_view"/);
  assert.match(read("src/components/client-root.tsx"), /<AnalyticsTracker\s*\/>/);
});

test("specialized funnels include actual project, code, quiz and contact actions", () => {
  for (const [file, event] of [
    ["src/components/contact-form.tsx", "contact_channel_open"],
    ["src/components/training-playground.tsx", "playground_run_complete"],
    ["src/components/theory-quiz.tsx", "quiz_complete"],
    ["src/components/projects/projects-explorer.tsx", "project_filter"],
  ]) assert.match(read(file), new RegExp(event));
});

test("SEO keeps live portfolio pages, canonical sitemap and Search Console integration", () => {
  const sitemap = read("src/app/sitemap.ts");
  assert.match(sitemap, /"\/services\/"/);
  assert.match(sitemap, /"\/projects\/"/);
  assert.match(sitemap, /new Set\(routes\)/);
  assert.match(sitemap, /publicProjects\.length/);
  assert.match(read("src/app/robots.ts"), /sitemap:/);
  assert.match(read("src/app/layout.tsx"), /NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION/);
  assert.match(read("src/app/layout.tsx"), /applicationName: "Mbiopeter"/);
});

test("independent public project directory has a truthful empty state", () => {
  const source = read("src/app/public-projects/page.tsx");
  assert.match(source, /publicProjects\.length === 0/);
  assert.match(source, /No standalone releases listed right now/);
  assert.match(source, /index: false/);
  assert.match(read("src/components/site-shell.tsx"), /publicProjects\.length > 0/);
});

test("privacy and opt-out are present without changing core design files", () => {
  assert.match(read("src/app/privacy/page.tsx"), /AnalyticsPreferences/);
  assert.match(read("src/lib/analytics.ts"), /ANALYTICS_OPT_OUT_KEY/);
  assert.match(read("src/lib/browser-boot.ts"), /analyticsOptOutKey/);
  assert.match(read("src/app/layout.tsx"), /styles\/playground\.css/);
});


test("root bootstraps without executable React script elements and keeps JSON-LD SEO", () => {
  const layout = read("src/app/layout.tsx");
  const boot = read("src/lib/browser-boot.ts");
  const packageFile = JSON.parse(read("package.json"));
  const lock = JSON.parse(read("package-lock.json"));
  assert.match(layout, /import \{ ClientRoot \} from "@\/components\/client-root"/);
  assert.match(layout, /type="application\/ld\+json"/);
  assert.doesNotMatch(layout, /<Script\b|strategy="beforeInteractive"/);
  assert.doesNotMatch(layout, /<script[^>]*__html: THEME_INIT_SCRIPT/);
  assert.match(boot, /document\.createElement\("script"\)/);
  assert.match(boot, /send_page_view: false/);
  assert.equal(packageFile.dependencies["@next/third-parties"], undefined);
  assert.equal(lock.packages[""].dependencies["@next/third-parties"], undefined);
  assert.equal(lock.packages["node_modules/@next/third-parties"], undefined);
});
