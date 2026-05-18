export const siteConfig = {
  name: "ResumeAI",
  description:
    "AI-powered resume builder for German and international job markets. Create professional Lebensläufe in minutes.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://german-resume-ai-builder.vercel.app",
  ogImage: "/og-image.png",
  links: {
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
  },
  creator: "ResumeAI Team",
} as const;

export const locales = ["en", "de"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
