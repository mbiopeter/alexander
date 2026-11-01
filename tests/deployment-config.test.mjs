import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const file = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("production canonical origin has a public, overridable default", () => {
  const value = file(".env.production");
  assert.match(value, /^NEXT_PUBLIC_SITE_URL=https:\/\/mbiopeter\.co\.ke$/m);
  assert.doesNotMatch(value, /(?:^|\n)(?:WHATSAPP_NUMBER|JUDGE0_AUTH_TOKEN|NEXT_PUBLIC_GA_ID)=/);
  assert.match(file(".gitignore"), /^!\.env\.production$/m);
});

test("esbuild install script approval is restricted to the locked version", () => {
  const manifest = JSON.parse(file("package.json"));
  const lock = JSON.parse(file("package-lock.json"));
  const version = lock.packages["node_modules/esbuild"].version;
  assert.deepEqual(manifest.allowScripts, { [`esbuild@${version}`]: true });
  assert.equal(manifest.allowScripts["esbuild"], undefined);
  assert.deepEqual(manifest.dependencies, lock.packages[""].dependencies);
  assert.deepEqual(manifest.devDependencies, lock.packages[""].devDependencies);
});

test("Vercel builds the server-side Next.js app", () => {
  const config = JSON.parse(file("vercel.json"));
  assert.equal(config.framework, "nextjs");
  assert.equal(config.buildCommand, "npm run build:ready");
  assert.equal(config.installCommand, "npm ci");
  assert.doesNotMatch(file(".npmrc"), /cache-dir|dangerously-allow-all-scripts/);
});


test("normal deployments warn for absent integrations, but strict launch checks remain available", () => {
  const scripts = JSON.parse(file("package.json")).scripts;
  assert.equal(scripts.build, "next build --webpack");
  assert.equal(scripts["build:ready"], "npm run check:config:build && npm run build");
  assert.equal(scripts["build:strict"], "npm run check:config && npm run build");
  assert.match(scripts["check:config:build"], /--allow-unconfigured/);
  assert.doesNotMatch(scripts["check:config"], /--allow-unconfigured/);
  const preflight = file("scripts/check-config.ts");
  assert.match(preflight, /missingDestinations/);
  assert.match(preflight, /!value && check\.required && allowUnconfigured/);
  assert.match(preflight, /whatsapp\.status === "invalid"/);
});
