import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_WHATSAPP_ENABLED: String(
      [
        process.env.WHATSAPP_USERNAME,
        process.env.WHATSAPP_NUMBER,
        process.env.NEXT_PUBLIC_WHATSAPP_USERNAME,
        process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
      ].some((value) => Boolean(value?.trim())),
    ),
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
      {
        source: "/api/contact/whatsapp/:path*",
        headers: [{ key: "Referrer-Policy", value: "no-referrer" }],
      },
    ];
  },
};

export default nextConfig;
