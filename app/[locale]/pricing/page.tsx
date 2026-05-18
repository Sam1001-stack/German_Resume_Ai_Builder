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
    title: t("pricing"),
    description: t("pricing"),
    path: "/pricing",
  });
}

export default async function PricingPage() {
  const t = await getTranslations("landing");
  return (
    <ContentPage title={t("pricingTitle")}>
      <p>{t("pricingSubtitle")}</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {["Free", "Pro", "Enterprise"].map((plan) => (
          <div
            key={plan}
            className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800"
          >
            <h3 className="text-lg font-semibold">{plan}</h3>
            <p className="mt-2 text-3xl font-bold">
              {plan === "Free" ? "€0" : plan === "Pro" ? "€12" : "Custom"}
            </p>
          </div>
        ))}
      </div>
    </ContentPage>
  );
}
