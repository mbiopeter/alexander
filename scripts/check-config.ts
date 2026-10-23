import { loadEnvConfig } from "@next/env";
import {
  validateGitHubUrl,
  validatePaystackUrl,
  validateSiteUrl,
  validateTikTokUrl,
} from "../src/lib/validation";
import { resolveWhatsAppConfiguration } from "../src/lib/whatsapp";

// Match `next build` while keeping private WhatsApp settings on the server.
loadEnvConfig(process.cwd(), false);

type Check = {
  key: string;
  required: boolean;
  validate: (value: string) => string | null;
  help: string;
};

const checks: Check[] = [
  {
    key: "NEXT_PUBLIC_PAYSTACK_PAYMENT_URL",
    required: true,
    validate: validatePaystackUrl,
    help: "Use your public https://paystack.com/pay/PAGE-SLUG URL, with no query string or fragment.",
  },
  {
    key: "NEXT_PUBLIC_TIKTOK_URL",
    required: true,
    validate: validateTikTokUrl,
    help: "Use your full https://www.tiktok.com/@YOUR-HANDLE profile URL, without tracking parameters.",
  },
  {
    key: "NEXT_PUBLIC_GITHUB_URL",
    required: false,
    validate: validateGitHubUrl,
    help: "Use a https://github.com/YOUR-USERNAME profile URL, or leave this optional value empty.",
  },
  {
    key: "NEXT_PUBLIC_SITE_URL",
    required: false,
    validate: validateSiteUrl,
    help: "Use your deployed HTTPS origin, with no subfolder, query string, or fragment.",
  },
];

let failures = 0;

const whatsapp = resolveWhatsAppConfiguration({
  WHATSAPP_USERNAME: process.env.WHATSAPP_USERNAME,
  WHATSAPP_NUMBER: process.env.WHATSAPP_NUMBER,
  NEXT_PUBLIC_WHATSAPP_USERNAME: process.env.NEXT_PUBLIC_WHATSAPP_USERNAME,
  NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
});
if (whatsapp.status === "missing") {
  failures += 1;
  console.error("\nMissing WhatsApp destination");
  console.error(
    "  Set WHATSAPP_USERNAME to your active WhatsApp username, or WHATSAPP_NUMBER to your international number (8–15 digits, no + or spaces).",
  );
} else if (whatsapp.status === "invalid") {
  failures += 1;
  console.error(`\nInvalid ${whatsapp.key}`);
  console.error(
    whatsapp.key.endsWith("USERNAME")
      ? "  Use your active WhatsApp username: 3–35 lowercase letters, digits, underscores or periods, including at least one letter. An optional leading @ is accepted."
      : "  Use your international WhatsApp number, digits only (8–15 digits; no +, spaces, or leading zero).",
  );
} else if (whatsapp.legacy) {
  console.warn(
    `\nMove ${whatsapp.key} to ${whatsapp.kind === "username" ? "WHATSAPP_USERNAME" : "WHATSAPP_NUMBER"} and remove the old public variable.`,
  );
}

for (const check of checks) {
  const value = process.env[check.key]?.trim() ?? "";
  if (!value && !check.required) continue;

  if (!value || !check.validate(value)) {
    failures += 1;
    console.error(`\n${value ? "Invalid" : "Missing"} ${check.key}`);
    console.error(`  ${check.help}`);
  }
}

if (failures > 0) {
  console.error(
    `\nConfiguration needs ${failures} correction${failures === 1 ? "" : "s"}. Update .env.local or your hosting environment and run this check again.`,
  );
  process.exitCode = 1;
} else {
  console.log(
    "WhatsApp contact, tutorial, and payment destinations are configured.",
  );
  console.log(
    "Open each destination yourself before publishing to confirm it belongs to you.",
  );
}

if (!process.env.NEXT_PUBLIC_SITE_URL?.trim()) {
  console.warn(
    "\nNEXT_PUBLIC_SITE_URL is optional. Add your final HTTPS domain and rebuild to enable complete canonical and social-sharing URLs.",
  );
}
