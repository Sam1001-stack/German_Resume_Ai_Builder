import { Suspense } from "react";
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

function BuilderLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
    </div>
  );
}

export default async function BuilderPage({ params }: Props) {
  const { locale } = await params;
  ensureRequestLocale(locale);
  return (
    <Suspense fallback={<BuilderLoading />}>
      <ResumeBuilderShell />
    </Suspense>
  );
}
