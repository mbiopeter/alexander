import assert from "node:assert/strict";
import test from "node:test";
import {
  createWhatsAppUrl,
  validateGitHubUrl,
  validatePaystackUrl,
  validateSiteUrl,
  validateTikTokUrl,
  validateWhatsAppNumber,
  validateWhatsAppUsername,
} from "./validation";
import { isTheme, resolveTheme } from "./theme";

test("WhatsApp uses an international number and preserves the exact message", () => {
  const message = "Hi Alexender! Debugging: a & b?\nCan we talk?";
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
