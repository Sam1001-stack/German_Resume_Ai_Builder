import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/config/site";

/** Call at the start of statically rendered pages so getTranslations uses the correct locale. */
export function ensureRequestLocale(locale: string): Locale {
  const resolved = routing.locales.includes(locale as Locale)
    ? (locale as Locale)
    : routing.defaultLocale;
  setRequestLocale(resolved);
  return resolved;
}
