import { getRequestConfig } from "next-intl/server";
import type { Locale } from "@/config/site";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  const base = (await import(`@/locales/${locale}.json`)).default;
  const analyzer = (await import(`@/locales/analyzer/${locale}.json`)).default;

  return {
    locale,
    messages: {
      ...base,
      builder: {
        ...base.builder,
        analyzer,
      },
    },
  };
});
