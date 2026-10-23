import assert from "node:assert/strict";
import test from "node:test";
import {
  createWhatsAppRedirect,
  MAX_WHATSAPP_MESSAGE_LENGTH,
  resolveWhatsAppConfiguration,
} from "./whatsapp";

function request(message?: string) {
  const url = new URL("https://alexender.example/api/contact/whatsapp/");
  if (message !== undefined) url.searchParams.set("text", message);
  return new Request(url);
}

test("private active username configuration takes precedence over phone settings", () => {
  assert.deepEqual(
    resolveWhatsAppConfiguration({
      WHATSAPP_USERNAME: " @alexender.dev ",
      WHATSAPP_NUMBER: "254700123456",
      NEXT_PUBLIC_WHATSAPP_NUMBER: "254700999999",
    }),
    {
      status: "configured",
      kind: "username",
      destination: "alexender.dev",
      key: "WHATSAPP_USERNAME",
      legacy: false,
    },
  );
});

test("number fallback works only when no username was selected", () => {
  assert.deepEqual(
    resolveWhatsAppConfiguration({
      WHATSAPP_USERNAME: " ",
      WHATSAPP_NUMBER: "254700123456",
    }),
    {
      status: "configured",
      kind: "number",
      destination: "254700123456",
      key: "WHATSAPP_NUMBER",
      legacy: false,
    },
  );
  assert.deepEqual(
    resolveWhatsAppConfiguration({
      WHATSAPP_USERNAME: "bad/name",
      WHATSAPP_NUMBER: "254700123456",
    }),
    { status: "invalid", key: "WHATSAPP_USERNAME" },
  );
});

test("legacy public destinations remain usable during migration", () => {
  assert.deepEqual(
    resolveWhatsAppConfiguration({
      NEXT_PUBLIC_WHATSAPP_NUMBER: "254700123456",
    }),
    {
      status: "configured",
      kind: "number",
      destination: "254700123456",
      key: "NEXT_PUBLIC_WHATSAPP_NUMBER",
      legacy: true,
    },
  );
  const legacyUsername = resolveWhatsAppConfiguration({
    NEXT_PUBLIC_WHATSAPP_USERNAME: "@alexender.dev",
    NEXT_PUBLIC_WHATSAPP_NUMBER: "254700123456",
  });
  assert.equal(legacyUsername.status, "configured");
  if (legacyUsername.status === "configured") {
    assert.equal(legacyUsername.kind, "username");
    assert.equal(legacyUsername.legacy, true);
  }
});

test("missing or malformed server configuration never redirects", async () => {
  assert.deepEqual(resolveWhatsAppConfiguration({}), { status: "missing" });
  for (const environment of [
    {},
    { WHATSAPP_NUMBER: "+254700123456" },
    { WHATSAPP_USERNAME: "https://evil.test" },
  ]) {
    const response = createWhatsAppRedirect(request("Hello"), environment);
    assert.equal(response.status, 503);
    assert.equal(response.headers.get("location"), null);
    assert.match(response.headers.get("cache-control") ?? "", /no-store/);
    const text = await response.text();
    assert.equal(text.includes("254700123456"), false);
    assert.equal(text.includes("evil.test"), false);
  }
});

test("username redirect keeps Unicode, whitespace, and special characters in the draft", () => {
  const message = "Hi Alexender! 👋\nPython + Django & C++?\n  Tell me more.  ";
  const response = createWhatsAppRedirect(request(message), {
    WHATSAPP_USERNAME: "alexender.dev",
  });
  assert.equal(response.status, 302);
  const location = new URL(response.headers.get("location")!);
  assert.equal(location.origin, "https://wa.me");
  assert.equal(location.pathname, "/alexender.dev");
  assert.equal(location.searchParams.get("text"), message);
  assert.match(response.headers.get("cache-control") ?? "", /no-store/);
  assert.equal(response.headers.get("referrer-policy"), "no-referrer");
  assert.match(response.headers.get("x-robots-tag") ?? "", /noindex/);
});

test("phone fallback preserves existing click-to-chat behavior", () => {
  const response = createWhatsAppRedirect(request("Hello!"), {
    WHATSAPP_NUMBER: "254700123456",
  });
  assert.equal(response.status, 302);
  assert.equal(
    response.headers.get("location"),
    "https://wa.me/254700123456?text=Hello!",
  );
  const emptyMessage = createWhatsAppRedirect(request(), {
    WHATSAPP_NUMBER: "254700123456",
  });
  assert.equal(
    new URL(emptyMessage.headers.get("location")!).searchParams.get("text"),
    "",
  );
});

test("callers cannot override the WhatsApp destination or introduce an open redirect", () => {
  const response = createWhatsAppRedirect(
    new Request(
      "https://alexender.example/api/contact/whatsapp/?url=https%3A%2F%2Fevil.test&phone=19999999999&username=someone_else&text=Hello",
    ),
    { WHATSAPP_USERNAME: "alexender.dev" },
  );
  const location = new URL(response.headers.get("location")!);
  assert.equal(location.origin, "https://wa.me");
  assert.equal(location.pathname, "/alexender.dev");
  assert.deepEqual([...location.searchParams.keys()], ["text"]);
});

test("overlong, duplicate, and control-character drafts return a noncacheable error", () => {
  const requests = [
    request("a".repeat(MAX_WHATSAPP_MESSAGE_LENGTH + 1)),
    request("Hello\0world"),
    new Request(
      "https://alexender.example/api/contact/whatsapp/?text=first&text=second",
    ),
  ];
  for (const input of requests) {
    const response = createWhatsAppRedirect(input, {
      WHATSAPP_USERNAME: "alexender.dev",
    });
    assert.equal(response.status, 400);
    assert.equal(response.headers.get("location"), null);
    assert.match(response.headers.get("cache-control") ?? "", /no-store/);
  }
  assert.equal(
    createWhatsAppRedirect(request("a".repeat(MAX_WHATSAPP_MESSAGE_LENGTH)), {
      WHATSAPP_USERNAME: "alexender.dev",
    }).status,
    302,
  );
});
