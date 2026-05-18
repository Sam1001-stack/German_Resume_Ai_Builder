import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { SiteLayout } from "@/components/layout/site-layout";
import { AppProviders } from "@/providers/app-providers";
import type { Locale } from "@/config/site";
import { createPageMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return createPageMetadata({
    locale: locale as Locale,
    title: t("title").replace(` | ResumeAI`, ""),
    description: t("description"),
  });
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <AppProviders>
      <NextIntlClientProvider messages={messages}>
        <SiteLayout>{children}</SiteLayout>
      </NextIntlClientProvider>
    </AppProviders>
  );
}
