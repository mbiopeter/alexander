import { cp, mkdir, access } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const project = dirname(dirname(fileURLToPath(import.meta.url)));
const packageRoot = dirname(require.resolve("monaco-editor/package.json"));

const source = join(packageRoot, "min", "vs");
const destination = join(project, "public", "monaco", "vs");

await access(source);
await mkdir(destination, { recursive: true });
await cp(source, destination, { recursive: true, force: true });

console.log("Monaco assets copied to public/monaco/vs.");