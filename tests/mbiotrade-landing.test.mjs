/** Dependency-free integration and regression checks for the mbioTraders showcase. */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => readFileSync(path.join(root, file), "utf8");
const page = "src/app/mbiotrade/page.tsx";
const shell = "src/components/site-shell.tsx";
const registry = "src/data/public-projects.ts";
const tour = "src/components/mbiotrade-tour.tsx";
const preview = "src/components/mbiotrade-preview.tsx";

test("a single public-project registry controls the exact live subdomain", () => {
  assert.ok(existsSync(path.join(root, registry)));
  assert.match(read(registry), /href: "\/mbiotrade\/"/);
  assert.match(read(registry), /name: "mbioTraders"/);
  assert.match(read(registry), /https:\/\/traders\.mbiopeter\.co\.ke\//);
  assert.doesNotMatch(read(registry), /mbiotrade\.vercel\.app/);
  assert.match(read(shell), /publicProjects\.map/);
  assert.match(read("src/app/public-projects/page.tsx"), /publicProjects\.map/);
  assert.match(read("src/lib/mbiotrade.ts"), /publicProjects\.find/);
});

test("desktop Public Projects dropdown stays hover, click and keyboard accessible", () => {
  const source = read(shell);
  assert.match(source, /Public Projects <ChevronDown/);
  assert.match(source, /onMouseEnter=\{\(\) => setPublicOpen\(true\)\}/);
  assert.match(source, /onMouseLeave=\{\(\) => setPublicOpen\(false\)\}/);
  assert.match(source, /aria-expanded=\{publicOpen\}/);
  assert.match(source, /aria-controls="public-projects-popover"/);
  assert.match(source, /event\.key === "Escape"/);
  assert.match(source, /closeOnOutsidePress/);
});

test("mobile Public Projects accordion remains independent of desktop navigation", () => {
  const source = read(shell);
  assert.match(source, /aria-expanded=\{mobilePublicOpen\}/);
  assert.match(source, /id="mobile-public-projects-list"/);
  assert.match(source, /href="\/public-projects\/"/);
});

test("landing page clearly describes the current signals-only product", () => {
  const source = read(page);
  for (const phrase of ["mbioTraders", "signal dashboard", "six timeframes", "3-, 5-", "No trading login", "does not send orders", "mbio-faq-list", "Gold", "BUY, SELL or WAIT"]) {
    assert.ok(source.toLowerCase().includes(phrase.toLowerCase()), `missing: ${phrase}`);
  }
  for (const old of ["Gold Pullback Rejection", "Account environments", "Deriv-connected trading workspace", "broker sync", "background worker"]) {
    assert.ok(!source.toLowerCase().includes(old.toLowerCase()), `obsolete feature advertised: ${old}`);
  }
  assert.match(source, /export default function MbiotradeLandingPage/);
  assert.match(source, /<MbiotradeTour\s*\/>/);
  assert.match(source, /<details key=\{q\}/);
});

test("dashboard screenshot assets are optimized and supplied as illustrative art", () => {
  for (const filename of ["mbiotraders-dashboard.webp", "mbiotraders-chart.webp", "mbiotraders-strength.webp", "mbiotraders-alignment.webp", "mbiotraders-setup.webp"]) {
    const item = path.join(root, "public", "images", filename);
    assert.ok(existsSync(item), `${filename} missing`);
    assert.ok(statSync(item).size > 9000, `${filename} empty`);
  }
  assert.ok(existsSync(path.join(root, "public/social/mbiotraders.png")));
  assert.match(read(preview), /INTERFACE PREVIEW/);
  assert.match(read(preview), /sample market values, not live signals/);
  assert.match(read(tour), /ILLUSTRATIVE UI/);
  assert.match(read(page), /Illustrative readings/);
});

test("four-tour tabs remain functional with keyboard navigation", () => {
  const source = read(tour);
  assert.match(source, /useState<TourId>\("chart"\)/);
  assert.match(source, /role="tablist"/);
  assert.match(source, /role="tab"/);
  assert.match(source, /aria-selected=\{active === id\}/);
  assert.match(source, /onClick=\{\(\) => setActive\(id\)\}/);
  assert.match(source, /event\.key === "ArrowRight"/);
  assert.match(source, /event\.key === "ArrowLeft"/);
  assert.match(source, /role="tabpanel"/);
});

test("all live product links use a shared destination with safe new-tab controls", () => {
  for (const file of [page, "src/components/mbiotrade-feature.tsx"]) {
    const source = read(file);
    assert.match(source, /href=\{MBIOTRADE_URL\}/);
    assert.match(source, /target="_blank" rel="noopener noreferrer"/);
  }
  assert.match(read("src/app/public-projects/page.tsx"), /href=\{project\.liveUrl\}/);
});

test("portfolio UI does not access market feeds, trading accounts or order APIs", () => {
  for (const file of [page, tour, preview, "src/components/mbiotrade-feature.tsx"]) {
    const source = read(file);
    assert.doesNotMatch(source, /(?:fetch\s*\(|new WebSocket\s*\(|api_token|DERIV_API_TOKEN|purchase\s*\()/);
  }
});

test("dark theme matches navy and emerald, light theme retains previous colors", () => {
  const source = read("src/app/globals.css");
  assert.match(source, /:root\[data-theme="dark"\]\s*\{[\s\S]*?--bg:\s*#04111c;/);
  assert.match(source, /--surface:\s*#071c29;/);
  assert.match(source, /--accent:\s*#25dfa6;/);
  assert.match(source, /--green:\s*#2be2ad;/);
  assert.match(source, /:root\s*\{[\s\S]*?--bg:\s*#f8f9f5;/);
  assert.match(source, /:root\s*\{[\s\S]*?--accent:\s*#d3f76b;/);
  assert.match(source, /prefers-color-scheme: dark/);
  assert.match(source, /\.editor-window \{ background:#071927/);
  assert.match(read("src/app/layout.tsx"), /color: "#04111c"/);
});

test("showcase is responsive and has reduced-motion support", () => {
  const source = read("src/styles/mbiotrade.css");
  assert.match(source, /max-width:860px/);
  assert.match(source, /max-width:650px/);
  assert.match(source, /prefers-reduced-motion: reduce/);
  assert.match(source, /\.mbio-preview-screen img \{ display:block;width:100%;height:auto/);
});

test("portfolio uses the supplied production origin for SEO", () => {
  assert.match(read("src/config/site.ts"), /https:\/\/mbiopeter\.co\.ke/);
  assert.match(read(page), /public\/social\/mbiotraders\.png|\/social\/mbiotraders\.png/);
  assert.match(read(page), /makeMetadata\(/);
  assert.match(read("src/app/sitemap.ts"), /publicProjects\.map/);
});

test("all original interactive projects and global navigation routes remain", () => {
  for (const slug of ["focusboard", "django-api-lab", "data-tidy"]) {
    assert.match(read("src/data/projects.ts"), new RegExp(`slug: "${slug}"`));
  }
  for (const route of ["services", "projects", "learn", "playground", "notes", "support", "hire", "about", "privacy"]) {
    assert.ok(existsSync(path.join(root, "src/app", route, "page.tsx")), `${route} missing`);
  }
  assert.match(read("src/components/home-page.tsx"), /<MbiotradeFeature\s*\/>/);
  assert.match(read("src/app/projects/page.tsx"), /<MbiotradeFeature placement="projects"\s*\/>/);
  assert.match(read("src/app/layout.tsx"), /styles\/mbiotrade\.css/);
  assert.match(read("src/app/layout.tsx"), /styles\/public-projects\.css/);
});
