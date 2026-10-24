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

/** One plain mailbox, not a mailto URL, display name, or recipient list. */
export function validateContactEmail(value: string): string | null {
  if (/[\r\n\0]/.test(value)) return null;
  const email = value.trim();
  if (email.length > 254) return null;
  const parts = email.split("@");
  if (parts.length !== 2) return null;
  const [local, domain] = parts;
  if (
    !local ||
    local.length > 64 ||
    local.startsWith(".") ||
    local.endsWith(".") ||
    local.includes("..") ||
    !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(local)
  ) return null;
  const labels = domain.split(".");
  if (
    labels.length < 2 ||
    labels.some((label) =>
      !/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/.test(label),
    ) ||
    !/[a-zA-Z]/.test(labels[labels.length - 1])
  ) return null;
  return email;
}

export function createEmailDraftUrl(
  email: string,
  subject: string,
  message: string,
): string | null {
  const recipient = validateContactEmail(email);
  if (!recipient) return null;
  // Encode the recipient as well as the query: characters such as ? and & can
  // occur in a valid mailbox, but must never introduce additional mail headers.
  const destination = encodeURIComponent(recipient).replace(/%40/g, "@");
  const heading = subject.replace(/[\r\n\0]+/g, " ").trim().slice(0, 160).replace(/[\uD800-\uDBFF]$/, "");
  const body = message.replace(/\r\n?|\n/g, "\r\n");
  return `mailto:${destination}?subject=${encodeURIComponent(heading)}&body=${encodeURIComponent(body)}`;
}

export function validateLinkedInUrl(value: string): string | null {
  const url = parseHttpsUrl(value);
  if (
    !url ||
    !["linkedin.com", "www.linkedin.com"].includes(url.hostname) ||
    !/^\/in\/[a-zA-Z0-9._~-]+\/?$/.test(url.pathname) ||
    url.search ||
    url.hash
  ) return null;
  return url.href;
}

/** A public HTTPS document link, or a PDF placed in this site's public folder. */
export function validateCvUrl(value: string): string | null {
  const candidate = value.trim();
  if (candidate.length > 2000) return null;
  if (/^\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_.-]+\.pdf$/i.test(candidate)) {
    return candidate;
  }
  return parseHttpsUrl(candidate)?.href ?? null;
}
