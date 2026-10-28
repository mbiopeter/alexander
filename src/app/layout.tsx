import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/dm-sans";
import "@fontsource-variable/manrope";
import "./globals.css";
import "@/styles/playground.css";
import "@/styles/mbiotrade.css";
import "@/styles/public-projects.css";
import { Providers } from "@/components/providers";
import { SiteShell } from "@/components/site-shell";
import { siteConfig } from "@/config/site";
import { getSiteUrl, getGitHubUrl, getLinkedInUrl, getTikTokUrl } from "@/lib/links";
import { THEME_INIT_SCRIPT } from "@/lib/theme";

const siteUrl = getSiteUrl();
const structuredProfile = siteUrl ? {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebSite", "@id": `${siteUrl}/#website`, url: siteUrl, name: "Mbiopeter", description: siteConfig.description, publisher: { "@id": `${siteUrl}/#person` } },
    { "@type": "Person", "@id": `${siteUrl}/#person`, name: "Mbiopeter", url: `${siteUrl}/about/`, description: "Developer and creator building websites, useful software and practical coding examples.", sameAs: [getGitHubUrl(), getLinkedInUrl(), getTikTokUrl()].filter(Boolean) },
  ],
} : null;

export const metadata: Metadata = {
  title: "Mbiopeter : Developer",
  description: siteConfig.description,
  applicationName: "Mbiopeter",
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  openGraph: {
    title: "Good ideas deserve great code. — Mbiopeter",
    description: siteConfig.description,
    type: "website",
    siteName: "Mbiopeter",
    ...(siteUrl
      ? {
          url: siteUrl,
          images: [
            {
              url: "/social-card.png",
              width: 1200,
              height: 630,
              alt: "Mbiopeter — Developer & Creator",
            },
          ],
        }
      : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: "Mbiopeter — Developer & Creator",
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
        {structuredProfile && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredProfile).replace(/</g, "\\u003c") }} />}

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
