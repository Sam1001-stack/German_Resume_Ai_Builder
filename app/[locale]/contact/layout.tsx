import { getTranslations } from "next-intl/server";
import { createPageMetadata } from "@/lib/seo";
import type { Locale } from "@/config/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return createPageMetadata({
    locale: locale as Locale,
    title: t("title"),
    description: t("subtitle"),
    path: "/contact",
  });
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
