import { getTranslations } from "next-intl/server";
import { ContentPage } from "@/components/shared/content-page";
import { createPageMetadata } from "@/lib/seo";
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

export default async function TemplatesPage() {
  const t = await getTranslations("landing");
  return (
    <ContentPage title={t("templatesTitle")}>
      <p>{t("templatesSubtitle")}</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[3/4] rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-zinc-100 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-800"
          />
        ))}
      </div>
    </ContentPage>
  );
}
