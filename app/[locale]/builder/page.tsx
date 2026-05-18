import { getTranslations } from "next-intl/server";
import { ResumeBuilderShell } from "@/features/resume-builder/resume-builder-shell";
import { createPageMetadata } from "@/lib/seo";
import { ensureRequestLocale } from "@/lib/ensure-locale";
import type { Locale } from "@/config/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "builder" });
  return createPageMetadata({
    locale: locale as Locale,
    title: t("pageTitle"),
    description: t("pageDescription"),
  });
}

export default async function BuilderPage({ params }: Props) {
  const { locale } = await params;
  ensureRequestLocale(locale);
  return <ResumeBuilderShell />;
}
