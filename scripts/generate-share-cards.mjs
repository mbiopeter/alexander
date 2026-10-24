// Optional asset regeneration. PNGs and editable SVGs are included in the ZIP.
// sharp is installed with the locked Next.js dependency tree.
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const output = new URL("../public/social/", import.meta.url);
await mkdir(output, { recursive: true });
const escape = (text) => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const cards = [
  { slug: "focusboard", eyebrow: "INTERACTIVE PROJECT", title: ["A little structure.", "More room to focus."], subtitle: ["Plan tasks. Track progress.", "Explore the decisions behind the build."], label: "Focusboard", fill: "#e5edda", lines: ["Make a little plan", "Build something useful", "Share it with the world"], kind: "tasks" },
  { slug: "django-api-lab", eyebrow: "API DESIGN DEMONSTRATION", title: ["Make the request.", "Understand the reply."], subtitle: ["Explore a browser-based API simulation", "and the thinking behind its responses."], label: "Django API Lab", fill: "#eae3f1", lines: ["GET /api/tasks/", '"status": 200', '"results": [...]'], kind: "code" },
  { slug: "data-tidy", eyebrow: "INTERACTIVE PROJECT", title: ["Messy CSV.", "A clearer next step."], subtitle: ["Clean, inspect and download your data.", "See how the browser demo is built."], label: "Data Tidy", fill: "#f5e8d8", lines: ["NAME        ROLE", "Ada         Developer", "Mina        Creator"], kind: "table" },
  { slug: "playground", eyebrow: "THE CODING PLAYGROUND", title: ["A little practice.", "A new possibility."], subtitle: ["Five languages. Small challenges.", "Your own space to try, learn and build."], label: "Coding playground", fill: "#e5edda", lines: ["def next_step():", "    try_something()", "    keep_learning()"], kind: "code" },
  { slug: "notes", eyebrow: "NOTES & RESOURCES", title: ["Small ideas", "worth keeping."], subtitle: ["Practical notes on debugging, data", "and learning one concept at a time."], label: "Notes from the workbench", fill: "#f0eddb", lines: ["Understand the problem", "Try one small change", "Keep what you learn"], kind: "tasks" },
];

for (const card of cards) {
  const rows = card.lines.map((line, i) => `<rect x="818" y="${270 + i * 63}" width="282" height="47" rx="9" fill="${card.kind === "code" ? "#27382d" : "#ffffff"}"/><text x="838" y="${300 + i * 63}" font-size="${card.kind === "code" ? "17" : "15"}" font-family="${card.kind === "tasks" ? "sans-serif" : "monospace"}" fill="${card.kind === "code" ? "#d3f76b" : "#314031"}">${escape(line)}</text>`).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#f8f9f5"/>
  <rect x="55" y="49" width="45" height="45" rx="12" fill="#d3f76b"/><text x="63" y="82" font-family="sans-serif" font-size="32" font-weight="700" fill="#1d2621">a.</text>
  <text x="114" y="81" font-family="sans-serif" font-size="24" font-weight="700" fill="#1d2621">alexender.</text>
  <text x="60" y="177" font-family="sans-serif" font-size="14" font-weight="600" letter-spacing="2" fill="#3a632c">${escape(card.eyebrow)}</text>
  ${card.title.map((line, i) => `<text x="55" y="${264 + i * 78}" font-family="sans-serif" font-size="61" letter-spacing="-2" font-weight="600" fill="${i === 1 ? "#3a632c" : "#1d2621"}">${escape(line)}</text>`).join("")}
  <path d="M60 362 Q290 350 641 360" fill="none" stroke="#bfdc8f" stroke-width="6" stroke-linecap="round"/>
  ${card.subtitle.map((line, i) => `<text x="60" y="${412 + i * 35}" font-family="sans-serif" font-size="23" fill="#657066">${escape(line)}</text>`).join("")}
  <rect x="785" y="157" width="350" height="344" rx="25" fill="${card.fill}"/>
  <rect x="802" y="196" width="316" height="275" rx="15" fill="${card.kind === "code" ? "#1d2921" : "#f8f9f5"}"/>
  <circle cx="822" cy="218" r="4" fill="#d78e80"/><circle cx="838" cy="218" r="4" fill="#d3bd6c"/><circle cx="854" cy="218" r="4" fill="#94b779"/>
  ${rows}
  <line x1="60" y1="535" x2="1140" y2="535" stroke="#e1e5dd"/>
  <text x="60" y="577" font-family="sans-serif" font-size="19" font-weight="600" fill="#1d2621">${escape(card.label)}</text>
  <text x="1140" y="577" text-anchor="end" font-family="sans-serif" font-size="16" fill="#657066">Thoughtfully built. Simply explained.</text>
  </svg>`;
  await writeFile(new URL(`${card.slug}.svg`, output), svg);
  await sharp(Buffer.from(svg)).png().toFile(fileURLToPath(new URL(`${card.slug}.png`, output)));
}
console.log(`Generated ${cards.length} social cards.`);
