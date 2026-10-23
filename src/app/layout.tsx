import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/dm-sans";
import "@fontsource-variable/manrope";
import "./globals.css";
import "@/styles/playground.css";
import { Providers } from "@/components/providers";
import { SiteShell } from "@/components/site-shell";
import { siteConfig } from "@/config/site";
import { getSiteUrl } from "@/lib/links";
import { THEME_INIT_SCRIPT } from "@/lib/theme";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Alexender : Developer",
  description: siteConfig.description,
  applicationName: "Alexender",
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  openGraph: {
    title: "Good ideas deserve great code. — Alexender",
    description: siteConfig.description,
    type: "website",
    siteName: "Alexender",
    ...(siteUrl
      ? {
          url: siteUrl,
          images: [
            {
              url: "/social-card.png",
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
    title: "Alexender — Developer & Creator",
    description: siteConfig.description,
    ...(siteUrl
      ? { images: [new URL("/social-card.png", siteUrl).toString()] }
      : {}),
  },
  icons: { icon: "/icon.svg", apple: "/apple-touch-icon.png" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f9f5" },
    { media: "(prefers-color-scheme: dark)", color: "#101413" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Providers>
          <SiteShell>{children}</SiteShell>
        </Providers>
      </body>
    </html>
  );
}
