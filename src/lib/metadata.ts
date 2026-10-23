import type { Metadata } from "next";
import { getSiteUrl } from "./links";

export function makeMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const origin = getSiteUrl();
  const fullTitle = title.includes("Alexender")
    ? title
    : `${title} — Alexender`;
  const pageUrl = origin ? new URL(path, origin).toString() : undefined;
  const imageUrl = origin
    ? new URL("/social-card.png", origin).toString()
    : undefined;
  return {
    title: { absolute: fullTitle },
    description,
    ...(pageUrl ? { alternates: { canonical: pageUrl } } : {}),
    openGraph: {
      title: fullTitle,
      description,
      type: "website",
      siteName: "Alexender",
      ...(pageUrl ? { url: pageUrl } : {}),
      ...(imageUrl
        ? {
            images: [
              {
                url: imageUrl,
                width: 1200,
                height: 630,
                alt: "Alexender — Developer & Creator",
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  };
}
