import { getTranslations } from "next-intl/server";
import { ContentPage } from "@/components/shared/content-page";
import { createPageMetadata } from "@/lib/seo";
import { ensureRequestLocale } from "@/lib/ensure-locale";
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

export default async function PricingPage({ params }: Props) {
  const { locale } = await params;
  ensureRequestLocale(locale);
  const tLanding = await getTranslations("landing");
  const tPages = await getTranslations("pages");

  const plans = [
    { key: "planFree" as const, price: "€0" },
    { key: "planPro" as const, price: "€12" },
    { key: "planEnterprise" as const, price: tPages("planCustom") },
  ];

  return (
    <ContentPage title={tLanding("pricingTitle")}>
      <p>{tLanding("pricingSubtitle")}</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.key}
            className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800"
          >
            <h3 className="text-lg font-semibold">{tPages(plan.key)}</h3>
            <p className="mt-2 text-3xl font-bold">{plan.price}</p>
          </div>
        ))}
      </div>
    </ContentPage>
  );
}
