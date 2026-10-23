import { siteConfig } from "../config/site";
import {
  validateGitHubUrl,
  validatePaystackUrl,
  validateSiteUrl,
  validateTikTokUrl,
} from "./validation";

export const defaultEnquiry =
  "Hi Alexender! I found your website and would like to discuss a project.";

export function getWhatsAppUrl(message = defaultEnquiry): string | null {
  if (!siteConfig.contact.whatsappEnabled) return null;
  return `/api/contact/whatsapp/?text=${encodeURIComponent(message)}`;
}

export function getPaystackUrl(): string | null {
  return validatePaystackUrl(siteConfig.payment.paystackPaymentUrl);
}

export function getTikTokUrl(): string | null {
  return validateTikTokUrl(siteConfig.socials.tiktokUrl);
}

export function getGitHubUrl(): string | null {
  return validateGitHubUrl(siteConfig.socials.githubUrl);
}

export function getSiteUrl(): string | null {
  return validateSiteUrl(siteConfig.url);
}
