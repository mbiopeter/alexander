export const siteConfig = {
  name: "Mbiopeter",
  title: "Developer & creator",
  description:
    "Websites, Python and Django development, custom software, automation, and debugging by Mbiopeter. Practical projects and short coding tutorials that make things click.",
  url: process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://mbiopeter.co.ke",
  contact: {
    whatsappEnabled: process.env.NEXT_PUBLIC_WHATSAPP_ENABLED === "true",
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ?? "",
  },
  socials: {
    tiktokUrl: process.env.NEXT_PUBLIC_TIKTOK_URL?.trim() ?? "",
    githubUrl: process.env.NEXT_PUBLIC_GITHUB_URL?.trim() ?? "",
    linkedinUrl: process.env.NEXT_PUBLIC_LINKEDIN_URL?.trim() ?? "",
  },
  profile: {
    cvUrl: process.env.NEXT_PUBLIC_CV_URL?.trim() ?? "",
  },
  payment: {
    paystackPaymentUrl:
      process.env.NEXT_PUBLIC_PAYSTACK_PAYMENT_URL?.trim() ?? "",
  },
} as const;
