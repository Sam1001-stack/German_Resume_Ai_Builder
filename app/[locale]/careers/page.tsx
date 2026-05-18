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
    title: t("careers"),
    description: t("careers"),
    path: "/careers",
  });
}

export default async function CareersPage() {
  const t = await getTranslations("pages");
  return <ContentPage title={t("careers")} />;
}
