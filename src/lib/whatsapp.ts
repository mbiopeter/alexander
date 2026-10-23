import {
  createWhatsAppUrl,
  validateWhatsAppNumber,
  validateWhatsAppUsername,
} from "./validation";

/** Pass this configuration only from server routes or local configuration tools. */
export type WhatsAppEnvironment = {
  WHATSAPP_USERNAME?: string;
  WHATSAPP_NUMBER?: string;
  NEXT_PUBLIC_WHATSAPP_USERNAME?: string;
  NEXT_PUBLIC_WHATSAPP_NUMBER?: string;
};

type DestinationKey = keyof WhatsAppEnvironment;

export type WhatsAppConfiguration =
  | {
      status: "configured";
      kind: "username" | "number";
      destination: string;
      key: DestinationKey;
      legacy: boolean;
    }
  | { status: "invalid"; key: DestinationKey }
  | { status: "missing" };

export const MAX_WHATSAPP_MESSAGE_LENGTH = 4000;

/**
 * A chosen username never silently falls back to the phone number when invalid.
 * This prevents a configuration typo from changing the selected privacy mode.
 */
export function resolveWhatsAppConfiguration(
  environment: WhatsAppEnvironment,
): WhatsAppConfiguration {
  const candidates: {
    key: DestinationKey;
    kind: "username" | "number";
  }[] = [
    { key: "WHATSAPP_USERNAME", kind: "username" },
    { key: "NEXT_PUBLIC_WHATSAPP_USERNAME", kind: "username" },
    { key: "WHATSAPP_NUMBER", kind: "number" },
    { key: "NEXT_PUBLIC_WHATSAPP_NUMBER", kind: "number" },
  ];

  for (const { key, kind } of candidates) {
    const value = environment[key]?.trim();
    if (!value) continue;
    const destination =
      kind === "username"
        ? validateWhatsAppUsername(value)
        : validateWhatsAppNumber(value);
    if (!destination) return { status: "invalid", key };
    return {
      status: "configured",
      kind,
      destination,
      key,
      legacy: key.startsWith("NEXT_PUBLIC_"),
    };
  }

  return { status: "missing" };
}

/**
 * The destination is built from allowlisted account identifiers, never from a
 * redirect URL supplied by the caller. No contact details are returned on error.
 */
export function createWhatsAppRedirect(
  request: Request,
  environment: WhatsAppEnvironment,
): Response {
  const headers = {
    "Cache-Control": "private, no-store, max-age=0",
    "Referrer-Policy": "no-referrer",
    "X-Robots-Tag": "noindex, nofollow, noarchive",
  };
  const requestUrl = new URL(request.url);
  const messages = requestUrl.searchParams.getAll("text");
  const message = messages[0] ?? "";

  if (
    messages.length > 1 ||
    message.length > MAX_WHATSAPP_MESSAGE_LENGTH ||
    /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(message)
  ) {
    return Response.json(
      { error: "This message is too long or contains unsupported characters." },
      { status: 400, headers },
    );
  }

  const configuration = resolveWhatsAppConfiguration(environment);
  if (configuration.status !== "configured") {
    return Response.json(
      {
        error:
          "WhatsApp contact is temporarily unavailable. Please try again later.",
      },
      { status: 503, headers },
    );
  }

  const location = createWhatsAppUrl(
    configuration.destination,
    message,
    configuration.kind,
  );
  if (!location) {
    return Response.json(
      {
        error:
          "WhatsApp contact is temporarily unavailable. Please try again later.",
      },
      { status: 503, headers },
    );
  }

  return new Response(null, {
    status: 302,
    headers: { ...headers, Location: location },
  });
}
