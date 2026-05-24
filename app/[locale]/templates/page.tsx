import { getTranslations } from "next-intl/server";
import { PageTransition } from "@/components/shared/page-transition";
import { TemplateGallery } from "@/features/resume-builder/components/template-gallery";
import { createPageMetadata } from "@/lib/seo";
import { ensureRequestLocale } from "@/lib/ensure-locale";
import type { Locale } from "@/config/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages" });
  return createPageMetadata({
    locale: locale as Locale,
    title: t("templates"),
    description: t("templates"),
    path: "/templates",
  });
}

export default async function TemplatesPage({ params }: Props) {
  const { locale } = await params;
  ensureRequestLocale(locale);
  const t = await getTranslations("landing");

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("templatesTitle")}</h1>
          <p className="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">
            {t("templatesSubtitle")}
          </p>
        </div>
        <div className="mt-10">
          <TemplateGallery />
        </div>
      </div>
    </PageTransition>
  );
}
