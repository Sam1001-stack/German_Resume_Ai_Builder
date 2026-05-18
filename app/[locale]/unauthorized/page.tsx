import { getTranslations } from "next-intl/server";
import { ShieldX } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/shared/page-transition";
import { createPageMetadata } from "@/lib/seo";
import { ensureRequestLocale } from "@/lib/ensure-locale";
import type { Locale } from "@/config/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });
  return createPageMetadata({
    locale: locale as Locale,
    title: t("unauthorized"),
    description: t("unauthorizedSubtitle"),
    path: "/unauthorized",
  });
}

export default async function UnauthorizedPage({ params }: Props) {
  const { locale } = await params;
  ensureRequestLocale(locale);
  const t = await getTranslations("auth");
  return (
    <PageTransition>
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
        <ShieldX className="h-16 w-16 text-red-500" />
        <h1 className="text-2xl font-bold">{t("unauthorized")}</h1>
        <p className="max-w-md text-zinc-600 dark:text-zinc-400">{t("unauthorizedSubtitle")}</p>
        <Button asChild>
          <Link href="/sign-in">{t("backToSignIn")}</Link>
        </Button>
      </div>
    </PageTransition>
  );
}
