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
  const project = ["focusboard", "django-api-lab", "data-tidy"].find((slug) => path === `/projects/${slug}/`);
  const shareImage = project ? `/social/${project}.png` : path.startsWith("/playground/") ? "/social/playground.png" : path.startsWith("/notes/") ? "/social/notes.png" : "/social-card.png";
  const imageUrl = origin
    ? new URL(shareImage, origin).toString()
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
                alt: fullTitle,
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
