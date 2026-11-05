import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { initializeSiteBrowser } from "../src/lib/browser-boot.ts";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

function withMockBrowser(run) {
  const previousWindow = globalThis.window;
  const previousDocument = globalThis.document;
  const byId = new Map();
  const elements = [];
  const doc = {
    createElement(name) { return { tagName: name, id: "", type: "", textContent: "", src: "", async: false }; },
    getElementById(id) { return byId.get(id) || null; },
    head: { appendChild(node) { elements.push(node); if (node.id) byId.set(node.id, node); } },
  };
  const window = {
    localStorage: { getItem: () => null },
  };
  globalThis.window = window;
  globalThis.document = doc;
  try { run({ window, doc, elements, byId }); }
  finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
    if (previousDocument === undefined) delete globalThis.document;
    else globalThis.document = previousDocument;
  }
}

const config = {
  analyticsId: "G-TEST12345",
  analyticsOptOutKey: "mbiopeter:analytics-disabled",
  structuredProfile: { "@context": "https://schema.org", name: "Mbiopeter" },
};

test("browser bootstrap is safe when rendered on the server", () => {
  assert.doesNotThrow(() => initializeSiteBrowser(config));
});

test("GA initialization loads only once and uses manual page views", () => {
  withMockBrowser(({ window, elements }) => {
    initializeSiteBrowser(config);
    initializeSiteBrowser(config);
    const tags = elements.filter((node) => node.id === "mbiopeter-google-tag");
    assert.equal(tags.length, 1);
    assert.equal(tags[0].async, true);
    assert.equal(tags[0].src, "https://www.googletagmanager.com/gtag/js?id=G-TEST12345");
    assert.equal(window.dataLayer.length, 2);
    assert.equal(window.dataLayer[0][0], "js");
    assert.deepEqual(window.dataLayer[1], ["config", "G-TEST12345", { send_page_view: false }]);
  });
});

test("browser boot applies stored GA opt-out before adding tag", () => {
  withMockBrowser(({ window, doc }) => {
    let wasDisabledWhenAdded = false;
    window.localStorage.getItem = () => "true";
    const previousAppend = doc.head.appendChild;
    doc.head.appendChild = (node) => {
      if (node.id === "mbiopeter-google-tag") wasDisabledWhenAdded = window["ga-disable-G-TEST12345"] === true;
      previousAppend(node);
    };
    initializeSiteBrowser(config);
    assert.equal(wasDisabledWhenAdded, true);
    assert.equal(window["ga-disable-G-TEST12345"], true);
  });
});

test("structured data is retained without depending on an analytics key", () => {
  withMockBrowser(({ elements }) => {
    initializeSiteBrowser({ ...config, analyticsId: null });
    const item = elements.find((node) => node.id === "mbiopeter-structured-data");
    assert.equal(item.type, "application/ld+json");
    assert.deepEqual(JSON.parse(item.textContent), config.structuredProfile);
    assert.equal(elements.some((node) => node.id === "mbiopeter-google-tag"), false);
  });
});

test("invalid GA identifier cannot create a remote script", () => {
  withMockBrowser(({ elements }) => {
    initializeSiteBrowser({ ...config, analyticsId: "G-TEST?&notvalid" });
    assert.equal(elements.some((node) => node.id === "mbiopeter-google-tag"), false);
  });
});

test("root hydration has one client boundary and no executable JSX script", () => {
  const layout = read("src/app/layout.tsx");
  const root = read("src/components/client-root.tsx");
  const boot = read("src/lib/browser-boot.ts");
  assert.match(layout, /import \{ ClientRoot \} from "@\/components\/client-root"/);
  assert.match(layout, /<ClientRoot analyticsId=\{gaId\}/);
  assert.doesNotMatch(layout, /<Providers>|<AnalyticsTracker|<SiteShell|<Script\b/);
  assert.match(layout, /type="application\/ld\+json"/);
  const htmlScriptElements = [...layout.matchAll(/<script\b([\s\S]*?)\/>/g)];
  assert.equal(htmlScriptElements.length, 1);
  assert.match(htmlScriptElements[0][1], /type="application\/ld\+json"/);
  assert.match(root, /initializeSiteBrowser/);
  assert.match(root, /<AnalyticsTracker\s*\/>/);
  assert.match(boot, /document\.createElement\("script"\)/);
  assert.doesNotMatch(root, /<script\b|<Script\b/);
});


test("client root has explicit named export and the editor avoids React lazy undefined resolutions", () => {
  const root = read("src/components/client-root.tsx");
  const training = read("src/components/training-playground.tsx");
  const loader = read("src/components/editor-loader.tsx");
  const editor = read("src/components/code-editor.tsx");
  assert.match(root, /export function ClientRoot\(/);
  assert.match(training, /import CodeEditor from "@\/components\/editor-loader"/);
  assert.doesNotMatch(training, /next\/dynamic|React\.lazy|\blazy\(/);
  assert.match(loader, /useEffect\(/);
  assert.match(loader, /typeof component === "function"/);
  assert.match(loader, /The rich editor could not load/);
  assert.match(loader, /props\.onChange\(event\.target\.value\)/);
  assert.match(loader, /onClick=\{props\.onRun\}/);
  assert.match(editor, /export default function CodeEditor\(/);
});

test("a root-level error falls back to a usable reload screen", () => {
  const source = read("src/app/global-error.tsx");
  assert.match(source, /export default function GlobalError/);
  assert.match(source, /reset\(\)/);
  assert.match(source, /window\.location\.reload\(\)/);
});
