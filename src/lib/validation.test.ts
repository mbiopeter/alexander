import assert from "node:assert/strict";
import test from "node:test";
import {
  createEmailDraftUrl,
  createWhatsAppUrl,
  validateContactEmail,
  validateCvUrl,
  validateGitHubUrl,
  validateLinkedInUrl,
  validatePaystackUrl,
  validateSiteUrl,
  validateTikTokUrl,
  validateWhatsAppNumber,
  validateWhatsAppUsername,
} from "./validation";
import { isTheme, resolveTheme } from "./theme";

test("WhatsApp uses an international number and preserves the exact message", () => {
  const message = "Hi Mbiopeter! Debugging: a & b?\nCan we talk?";
  const link = createWhatsAppUrl("254700123456", message);
  assert.ok(link);
  const url = new URL(link);
  assert.equal(url.hostname, "wa.me");
  assert.equal(url.pathname, "/254700123456");
  assert.equal(url.searchParams.get("text"), message);
});

test("missing and malformed WhatsApp destinations cannot create links", () => {
  for (const number of [
    "",
    "+254700123456",
    "0700123456",
    "123",
    "254 700 123456",
    "254700123456?x=1",
  ]) {
    assert.equal(validateWhatsAppNumber(number), null);
    assert.equal(createWhatsAppUrl(number, "Hello"), null);
  }
});

test("WhatsApp usernames accept an optional @ without permitting arbitrary URLs", () => {
  assert.equal(
    validateWhatsAppUsername("  @alexender.dev_2  "),
    "alexender.dev_2",
  );
  assert.equal(validateWhatsAppUsername("alexender"), "alexender");
  for (const username of [
    "",
    "ab",
    "a".repeat(36),
    "123456",
    "UPPERCASE",
    "alex ender",
    "https://wa.me/alexender",
    "//evil.test",
    "alexender?phone=1234",
    "alexender/anything",
    "@@alexender",
  ]) {
    assert.equal(validateWhatsAppUsername(username), null);
    assert.equal(createWhatsAppUrl(username, "Hello", "username"), null);
  }
  const link = createWhatsAppUrl(
    "@alexender.dev",
    "Hi + hello & thanks!",
    "username",
  );
  assert.ok(link);
  assert.equal(new URL(link).pathname, "/alexender.dev");
  assert.equal(new URL(link).searchParams.get("text"), "Hi + hello & thanks!");
});

test("Paystack links only accept a hosted HTTPS payment page", () => {
  assert.equal(
    validatePaystackUrl("https://paystack.com/pay/alexender-support"),
    "https://paystack.com/pay/alexender-support",
  );
  for (const link of [
    "",
    "javascript:alert(1)",
    "http://paystack.com/pay/alexender",
    "https://paystack.com.evil.test/pay/alexender",
    "https://paystack.com@evil.test/pay/alexender",
    "https://evil.test/pay/alexender",
    "https://paystack.com/",
    "https://paystack.com/pay/",
    "https://paystack.com/pay/alexender?amount=1",
    "https://paystack.com/pay/alexender#amount",
  ]) {
    assert.equal(validatePaystackUrl(link), null);
  }
});

test("social links point only to the configured service profile", () => {
  assert.equal(
    validateTikTokUrl("https://www.tiktok.com/@alexender"),
    "https://www.tiktok.com/@alexender",
  );
  assert.equal(
    validateGitHubUrl("https://github.com/alexender-dev"),
    "https://github.com/alexender-dev",
  );
  assert.equal(
    validateTikTokUrl("https://www.tiktok.com/@alexender/video/1"),
    null,
  );
  assert.equal(
    validateTikTokUrl("https://www.tiktok.com.evil.test/@alexender"),
    null,
  );
  assert.equal(validateGitHubUrl("https://github.com/user/repo"), null);
  assert.equal(
    validateGitHubUrl("https://github.com@evil.test/alexender"),
    null,
  );
});

test("canonical URL rejects unsafe URLs and normalizes a trailing slash", () => {
  assert.equal(
    validateSiteUrl("https://alexender.example/"),
    "https://alexender.example",
  );
  assert.equal(validateSiteUrl("javascript:alert(1)"), null);
  assert.equal(validateSiteUrl("https://name:secret@alexender.example"), null);
  assert.equal(validateSiteUrl("https://alexender.example/subfolder/"), null);
});

test("theme follows the device only while the preference is system", () => {
  assert.equal(resolveTheme("system", true), "dark");
  assert.equal(resolveTheme("system", false), "light");
  assert.equal(resolveTheme("light", true), "light");
  assert.equal(resolveTheme("dark", false), "dark");
  assert.equal(isTheme("system"), true);
  assert.equal(isTheme("unknown"), false);
});

test("email drafts preserve the brief without introducing recipients or headers", () => {
  const link = createEmailDraftUrl(
    "owner+projects@example.test",
    "Project & enquiry?\nA second line",
    "A café website & a booking flow?\nBudget: let’s discuss.\nThanks!",
  );
  assert.ok(link);
  const url = new URL(link);
  assert.equal(url.protocol, "mailto:");
  assert.equal(decodeURIComponent(url.pathname), "owner+projects@example.test");
  assert.equal(url.searchParams.get("subject"), "Project & enquiry? A second line");
  assert.equal(url.searchParams.get("body"), "A café website & a booking flow?\r\nBudget: let’s discuss.\r\nThanks!");
  assert.deepEqual([...url.searchParams.keys()], ["subject", "body"]);
  const special = createEmailDraftUrl("owner?cc=someone@example.test", "Hello", "A normal brief");
  assert.ok(special);
  assert.equal(new URL(special).searchParams.has("cc"), false);
  const unicodeBoundary = createEmailDraftUrl("owner@example.test", "a".repeat(159) + "😀", "A normal brief");
  assert.ok(unicodeBoundary);
  assert.equal(new URL(unicodeBoundary).searchParams.get("subject"), "a".repeat(159));
});

test("optional email destinations reject lists, display names, and injected headers", () => {
  assert.equal(validateContactEmail(" owner+work@example.test "), "owner+work@example.test");
  for (const value of [
    "", "mailto:owner@example.test", "Name <owner@example.test>",
    "one@example.test,two@example.test", "one@example.test;two@example.test",
    "one@example.test\r\nBcc: two@example.test", "owner@example.test\n",
    "owner@localhost", "owner@-example.test", ".owner@example.test", "owner..name@example.test",
  ]) {
    assert.equal(validateContactEmail(value), null);
    assert.equal(createEmailDraftUrl(value, "Hello", "Test"), null);
  }
});

test("optional professional links accept real destinations and reject unsafe alternatives", () => {
  assert.equal(validateLinkedInUrl("https://www.linkedin.com/in/alexender-profile/"), "https://www.linkedin.com/in/alexender-profile/");
  for (const value of ["", "https://linkedin.com.evil.test/in/name", "https://www.linkedin.com/in/name?tracking=1", "https://www.linkedin.com/company/name", "javascript:alert(1)"]) {
    assert.equal(validateLinkedInUrl(value), null);
  }
  assert.equal(validateCvUrl("/files/alexender-cv.pdf"), "/files/alexender-cv.pdf");
  assert.equal(validateCvUrl("https://documents.example.test/cv.pdf"), "https://documents.example.test/cv.pdf");
  for (const value of ["", "//evil.test/cv.pdf", "/../private/cv.pdf", "/files/cv.pdf?redirect=1", "javascript:alert(1)", "http://example.test/cv.pdf", "https://user:password@example.test/cv.pdf"]) {
    assert.equal(validateCvUrl(value), null);
  }
});
