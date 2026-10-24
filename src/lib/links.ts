import { siteConfig } from "../config/site";
import {
  createEmailDraftUrl,
  validateContactEmail,
  validateCvUrl,
  validateGitHubUrl,
  validateLinkedInUrl,
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

export function getContactEmail(): string | null {
  return validateContactEmail(siteConfig.contact.email);
}

export function getEmailDraftUrl(
  message = defaultEnquiry,
  subject = "Project enquiry from your website",
): string | null {
  return createEmailDraftUrl(siteConfig.contact.email, subject, message);
}

export function getLinkedInUrl(): string | null {
  return validateLinkedInUrl(siteConfig.socials.linkedinUrl);
}

export function getCvUrl(): string | null {
  return validateCvUrl(siteConfig.profile.cvUrl);
}
