import { getTranslations } from "next-intl/server";
import { RecruiterBuilderShell } from "@/features/recruiter-builder/recruiter-builder-shell";
import { createPageMetadata } from "@/lib/seo";
import { ensureRequestLocale } from "@/lib/ensure-locale";
import type { Locale } from "@/config/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "recruiterBuilder" });
  return createPageMetadata({
    locale: locale as Locale,
    title: t("pageTitle"),
    description: t("pageDescription"),
    path: "/recruiter-builder",
  });
}

export default async function RecruiterBuilderPage({ params }: Props) {
  const { locale } = await params;
  ensureRequestLocale(locale);
  return <RecruiterBuilderShell />;
}
