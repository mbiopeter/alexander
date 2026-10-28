/** Dependency-free checks for the public-projects integration and MbioTrade showcase. */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => readFileSync(path.join(root, file), "utf8");
const page = "src/app/mbiotrade/page.tsx";
const shell = "src/components/site-shell.tsx";
const registry = "src/data/public-projects.ts";

test("a single public project registry powers the menu and public projects page", () => {
  assert.ok(existsSync(path.join(root, registry)));
  assert.match(read(registry), /href: "\/mbiotrade\/"/);
  assert.match(read(registry), /https:\/\/mbiotrade\.vercel\.app\//);
  assert.match(read(shell), /publicProjects\.map/);
  assert.match(read("src/app/public-projects/page.tsx"), /publicProjects\.map/);
  assert.match(read("src/lib/mbiotrade.ts"), /publicProjects\.find/);
});

test("desktop Public Projects menu opens by hover or click, with keyboard and outside click closure", () => {
  const source = read(shell);
  assert.match(source, /Public Projects <ChevronDown/);
  assert.match(source, /onMouseEnter=\{\(\) => setPublicOpen\(true\)\}/);
  assert.match(source, /onMouseLeave=\{\(\) => setPublicOpen\(false\)\}/);
  assert.match(source, /onClick=\{\(\) => setPublicOpen\(true\)\}/);
  assert.match(source, /aria-expanded=\{publicOpen\}/);
  assert.match(source, /aria-controls="public-projects-popover"/);
  assert.match(source, /event\.key === "Escape"/);
  assert.match(source, /closeOnOutsidePress/);
  assert.doesNotMatch(source, /\{ href: "\/mbiotrade\/", label: "MbioTrade" \}/);
});

test("mobile Public Projects accordion is independent from desktop dropdown", () => {
  const source = read(shell);
  assert.match(source, /aria-expanded=\{mobilePublicOpen\}/);
  assert.match(source, /id="mobile-public-projects-list"/);
  assert.match(source, /mobileProjects|mobilePublicOpen/);
  assert.match(source, /href="\/public-projects\/"/);
});

test("landing page, interactive tour and preview exist", () => {
  for (const file of [page, "src/components/mbiotrade-preview.tsx", "src/components/mbiotrade-feature.tsx", "src/components/mbiotrade-tour.tsx", "src/styles/mbiotrade.css", "src/styles/public-projects.css"]) {
    assert.ok(existsSync(path.join(root, file)), `${file} missing`);
  }
  assert.match(read(page), /export default function MbiotradeLandingPage/);
  assert.match(read(page), /<MbiotradeTour\s*\/>/);
  assert.match(read("src/components/mbiotrade-tour.tsx"), /aria-pressed=\{active === id\}/);
  assert.match(read("src/components/mbiotrade-tour.tsx"), /NO LIVE DATA|ILLUSTRATIVE|illustrative/);
});

test("the richer landing explains strategy, risk, broker sync, worker, and clear limitations", () => {
  const source = read(page);
  for (const phrase of ["Gold Pullback Rejection", "Broker-sourced positions", "broker account", "background worker", "No strategy has guaranteed results", "mbio-faq-list", "Demo"]) {
    assert.ok(source.toLowerCase().includes(phrase.toLowerCase()), `missing: ${phrase}`);
  }
  assert.match(source, /id="mbio-strategies"/);
  assert.match(source, /id="mbio-tour"|<MbiotradeTour/);
  assert.match(source, /<details key=\{q\}/);
  assert.match(source, /href="\/public-projects\/"/);
});

test("all launch links use the single official URL and safe new-tab attributes", () => {
  for (const file of [page, "src/components/mbiotrade-feature.tsx"]) {
    const source = read(file);
    assert.match(source, /href=\{MBIOTRADE_URL\}/);
    assert.match(source, /target="_blank" rel="noopener noreferrer"/);
  }
  const source = read("src/app/public-projects/page.tsx");
  assert.match(source, /href=\{project\.liveUrl\}/);
  assert.match(source, /target="_blank" rel="noopener noreferrer"/);
});

test("original pages, public project index, footer and sitemap are discoverable", () => {
  assert.match(read("src/components/home-page.tsx"), /<MbiotradeFeature\s*\/>/);
  assert.match(read("src/app/projects/page.tsx"), /<MbiotradeFeature placement="projects"\s*\/>/);
  assert.match(read(shell), /href="\/public-projects\/"/);
  assert.match(read("src/app/sitemap.ts"), /"\/public-projects\/"/);
  assert.match(read("src/app/sitemap.ts"), /publicProjects\.map/);
  for (const slug of ["focusboard", "django-api-lab", "data-tidy"]) {
    assert.match(read("src/data/projects.ts"), new RegExp(`slug: "${slug}"`));
  }
});

test("no showcase component makes trades or live API calls", () => {
  for (const file of [page, "src/components/mbiotrade-tour.tsx", "src/components/mbiotrade-preview.tsx"]) {
    const source = read(file);
    assert.doesNotMatch(source, /(?:fetch\s*\(|WebSocket\s*\(|api_token|DERIV_API_TOKEN)/);
  }
  assert.match(read("src/components/mbiotrade-preview.tsx"), /NO LIVE DATA/);
  assert.match(read(page), /This is the project showcase/);
});

test("styles are isolated and reduce motion", () => {
  const layout = read("src/app/layout.tsx");
  assert.match(layout, /styles\/mbiotrade\.css/);
  assert.match(layout, /styles\/public-projects\.css/);
  assert.match(read("src/styles/mbiotrade.css"), /prefers-reduced-motion/);
  assert.match(read("src/styles/public-projects.css"), /prefers-reduced-motion/);
});
