"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useToast } from "@/context/toast-context";
import {
  getGitHubUrl,
  getPaystackUrl,
  getTikTokUrl,
  getWhatsAppUrl,
} from "@/lib/links";

type Destination = "whatsapp" | "paystack" | "tiktok" | "github";
const unavailable: Record<Destination, string> = {
  whatsapp: "WhatsApp enquiries will be available soon. Please check back shortly.",
  paystack: "Support is opening soon. Thank you for wanting to support my work!",
  tiktok: "My TikTok link is coming soon. Explore the mini lessons in the meantime.",
  github: "My GitHub link is coming soon.",
};

export function DestinationLink({
  destination,
  message,
  children,
  className = "",
  label,
  fallbackHref,
}: {
  destination: Destination;
  message?: string;
  children: ReactNode;
  className?: string;
  label?: string;
  fallbackHref?: string;
}) {
  const { notify } = useToast();
  const href =
    destination === "whatsapp"
      ? getWhatsAppUrl(message)
      : destination === "paystack"
        ? getPaystackUrl()
        : destination === "tiktok"
          ? getTikTokUrl()
          : getGitHubUrl();
  if (href)
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}>
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  if (fallbackHref)
    return (
      <Link href={fallbackHref} className={className} aria-label={label}>
        {children}
      </Link>
    );
  return (
    <button
      type="button"
      className={className}
      aria-label={label}
      onClick={() => notify(unavailable[destination])}>
      {children}
    </button>
  );
}

export function TikTokIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true">
      <path d="M15.6 2h-3.2v13.2a3 3 0 1 1-2.6-3V9a6.2 6.2 0 1 0 5.8 6.2V8.4A9 9 0 0 0 21 10V6.8A5.6 5.6 0 0 1 15.6 2Z" />
    </svg>
  );
}
