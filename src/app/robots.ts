import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/links";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const url = getSiteUrl();
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(url ? { sitemap: new URL("/sitemap.xml", url).toString() } : {}),
  };
}
