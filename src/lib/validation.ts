/** Validate public destinations before generating outbound links. */
function parseHttpsUrl(value: string): URL | null {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" || url.username || url.password || url.port) {
      return null;
    }
    return url;
  } catch {
    return null;
  }
}

export function validateWhatsAppNumber(value: string): string | null {
  const number = value.trim();
  return /^[1-9]\d{7,14}$/.test(number) ? number : null;
}

/** Accept a WhatsApp username, optionally pasted with its display @ prefix. */
export function validateWhatsAppUsername(value: string): string | null {
  const username = value.trim().replace(/^@/, "");
  return /^[a-z0-9_.]{3,35}$/.test(username) && /[a-z]/.test(username)
    ? username
    : null;
}

export function createWhatsAppUrl(
  destination: string,
  message: string,
  kind: "number" | "username" = "number",
): string | null {
  const validDestination =
    kind === "username"
      ? validateWhatsAppUsername(destination)
      : validateWhatsAppNumber(destination);
  if (!validDestination) return null;
  return `https://wa.me/${validDestination}?text=${encodeURIComponent(message)}`;
}

export function validatePaystackUrl(value: string): string | null {
  const url = parseHttpsUrl(value);

  const allowedHosts = [
    "paystack.com",
    "www.paystack.com",
    "paystack.shop",
    "www.paystack.shop",
  ];

  if (
    !url ||
    !allowedHosts.includes(url.hostname) ||
    !/^\/pay\/[a-zA-Z0-9._~-]+\/?$/.test(url.pathname) ||
    url.search ||
    url.hash
  ) {
    return null;
  }
  return url.href;
}

export function validateTikTokUrl(value: string): string | null {
  const url = parseHttpsUrl(value);
  if (
    !url ||
    !["tiktok.com", "www.tiktok.com"].includes(url.hostname) ||
    !/^\/@[a-zA-Z0-9_.]+\/?$/.test(url.pathname) ||
    url.search ||
    url.hash
  ) {
    return null;
  }
  return url.href;
}

export function validateGitHubUrl(value: string): string | null {
  const url = parseHttpsUrl(value);
  if (
    !url ||
    url.hostname !== "github.com" ||
    !/^\/[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?\/?$/.test(
      url.pathname,
    ) ||
    url.search ||
    url.hash
  ) {
    return null;
  }
  return url.href;
}

export function validateSiteUrl(value: string): string | null {
  const url = parseHttpsUrl(value);
  if (!url || url.search || url.hash || url.pathname !== "/") return null;
  return url.href.replace(/\/$/, "");
}
