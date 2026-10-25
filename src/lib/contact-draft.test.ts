import assert from "node:assert/strict";
import test from "node:test";
import {
  buildContactMessage,
  emptyContactBrief,
  hasContactBrief,
  readContactDraft,
  serializeContactDraft,
  validateContactBrief,
} from "./contact-draft";

const services = ["web-development", "debugging", "something-else"];
const brief = {
  ...emptyContactBrief(),
  service: "web-development",
  name: "A visitor",
  project: "Café & booking",
  message: "A small website for our café.\nWe need a menu and booking form.",
};

test("a saved enquiry restores all fields, including unfinished multiline text", () => {
  const incomplete = { ...brief, message: "Still writing…\n" };
  assert.deepEqual(readContactDraft(serializeContactDraft(incomplete), services), incomplete);
  assert.equal(hasContactBrief(incomplete), true);
  assert.equal(hasContactBrief(emptyContactBrief()), false);
  assert.deepEqual(readContactDraft(serializeContactDraft(emptyContactBrief()), services), emptyContactBrief());
});

test("corrupt, unexpected, and oversized stored enquiries cannot enter the form", () => {
  for (const raw of [
    null,
    "not JSON",
    "[]",
    JSON.stringify({ version: 2, fields: brief }),
    JSON.stringify({ version: 1, fields: { ...brief, name: { value: "name" } } }),
    JSON.stringify({ version: 1, fields: { ...brief, message: "x".repeat(2001) } }),
    JSON.stringify({ version: 1, fields: { ...brief, name: "bad\0name" } }),
    JSON.stringify({ version: 1, fields: { service: "debugging" } }),
    " ".repeat(20_001),
  ]) assert.equal(readContactDraft(raw, services), null);
  const renamed = readContactDraft(serializeContactDraft({ ...brief, service: "retired-service" }), services);
  assert.equal(renamed?.service, "");
  assert.equal(renamed?.message, brief.message);
});

test("refresh keeps an edited service, while a new service link can preselect another", () => {
  const edited = { ...brief, service: "debugging" };
  const saved = serializeContactDraft(edited, "web-development");
  assert.equal(readContactDraft(saved, services, "web-development")?.service, "debugging");
  assert.equal(readContactDraft(saved, services, "something-else")?.service, "something-else");
  assert.equal(readContactDraft(saved, services)?.service, "debugging");
  assert.equal(readContactDraft(saved, services, "invalid-service")?.service, "debugging");
});

test("email, WhatsApp, and copied briefs share the same required content", () => {
  assert.deepEqual(validateContactBrief(brief, services), {});
  assert.equal(buildContactMessage(brief, "Web development"), [
    "Hi Mbiopeter! I'd like to discuss a project.",
    "", "Name: A visitor", "Service: Web development", "Project: Café & booking",
    "", "Project details:", brief.message,
    "", "I found you through your website.",
  ].join("\n"));
  assert.ok(validateContactBrief({ ...brief, service: "not-a-service" }, services).service);
  assert.ok(validateContactBrief({ ...brief, message: "  too short  " }, services).message);
  assert.ok(validateContactBrief({ ...brief, name: "n".repeat(81) }, services).name);
});
