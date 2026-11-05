import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const read = (path) => readFileSync(resolve(path), "utf8");

test("independent public project registry remains ready for future applications", () => {
  const registry = read("src/data/public-projects.ts");
  assert.match(registry, /export type PublicProject/);
  assert.match(registry, /publicProjects: PublicProject\[\] = \[\]/);
  assert.match(registry, /liveUrl: string/);
});

test("empty public project listing is transparent and links to the working demo gallery", () => {
  const page = read("src/app/public-projects/page.tsx");
  assert.match(page, /publicProjects\.length === 0/);
  assert.match(page, /No standalone releases listed right now/);
  assert.match(page, /href="\/projects\/"/);
  assert.match(page, /index: false/);
});

test("menus hide when there are no independent releases and automatically return if registered", () => {
  const header = read("src/components/site-shell.tsx");
  assert.equal((header.match(/link\.href === "\/projects\/" && publicProjects\.length > 0/g) || []).length, 2);
  assert.match(header, /publicProjects\.map/);
  assert.match(header, /publicProjects\.length > 0 && <Link href="\/public-projects\/"/);
});

test("original interactive portfolio projects remain accessible", () => {
  const home = read("src/components/home-page.tsx");
  const projects = read("src/app/projects/page.tsx");
  for (const source of [home, projects]) assert.match(source, /project/i);
  assert.match(home, /<ProjectCard project=\{project\}/);
  assert.match(projects, /<ProjectsExplorer \/>/);
  assert.match(read("src/app/sitemap.ts"), /publicProjects\.length/);
  assert.match(read("src/app/layout.tsx"), /styles\/public-projects\.css/);
});
