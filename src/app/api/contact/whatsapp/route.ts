import { createWhatsAppRedirect } from "@/lib/whatsapp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(request: Request) {
  return createWhatsAppRedirect(request, {
    WHATSAPP_USERNAME: process.env.WHATSAPP_USERNAME,
    WHATSAPP_NUMBER: process.env.WHATSAPP_NUMBER,
    // Migration support only. Prefer the private variables above.
    NEXT_PUBLIC_WHATSAPP_USERNAME: process.env.NEXT_PUBLIC_WHATSAPP_USERNAME,
    NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
  });
}
