import { readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

// Import in one process so every test is reported on hosts with restricted
// child-process pipes. Include both the portfolio and the playground suites.
const directories = [
  new URL("../src/lib/", import.meta.url),
  new URL("../tests/", import.meta.url),
];
let count = 0;
for (const directory of directories) {
  const files = (await readdir(fileURLToPath(directory)))
    .filter((name) => name.endsWith(".test.ts"))
    .sort();
  for (const file of files) {
    await import(new URL(file, directory).href);
    count++;
  }
}
if (count === 0) throw new Error("No test files were found.");
