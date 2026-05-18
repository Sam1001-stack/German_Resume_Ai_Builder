import { defaultLocale, locales, type Locale } from "@/config/site";

export const localePathPattern = new RegExp(`^/(${locales.join("|")})(?=/|$)`);

export function stripLocalePrefix(pathname: string): string {
  return pathname.replace(localePathPattern, "") || "/";
}

export function getLocaleFromPathname(pathname: string): Locale {
  const match = pathname.match(localePathPattern);
  const code = match?.[1];
  if (code && locales.includes(code as Locale)) {
    return code as Locale;
  }
  return defaultLocale;
}

export const dateLocaleMap: Record<Locale, string> = {
  en: "en-US",
  de: "de-DE",
};

export const openGraphLocaleMap: Record<Locale, string> = {
  en: "en_US",
  de: "de_DE",
};

const resumePreviewLabels = {
  summary: { en: "Summary", de: "Profil" },
  skills: { en: "Skills", de: "Fähigkeiten" },
  experience: { en: "Experience", de: "Berufserfahrung" },
  education: { en: "Education", de: "Ausbildung" },
  projects: { en: "Projects", de: "Projekte" },
  languages: { en: "Languages", de: "Sprachen" },
  certifications: { en: "Certifications", de: "Zertifikate" },
  present: { en: "Present", de: "heute" },
} as const;

export type ResumePreviewLabelKey = keyof typeof resumePreviewLabels;

export function resumePreviewLabel(locale: string, key: ResumePreviewLabelKey): string {
  const labels = resumePreviewLabels[key];
  if (locale in labels) return labels[locale as Locale];
  return labels.en;
}
