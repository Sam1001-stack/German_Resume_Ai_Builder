import { getTranslations } from "next-intl/server";
import { FeaturesSection } from "@/features/landing/features-section";
import { createPageMetadata } from "@/lib/seo";
import type { Locale } from "@/config/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages" });
  return createPageMetadata({
    locale: locale as Locale,
    title: t("features"),
    description: t("features"),
    path: "/features",
  });
}

export default function FeaturesPage() {
  return <FeaturesSection />;
}
