import { getTranslations } from "next-intl/server";
import { CheckCircle } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/components/auth/auth-layout";
import { createPageMetadata } from "@/lib/seo";
import { ensureRequestLocale } from "@/lib/ensure-locale";
import type { Locale } from "@/config/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });
  return createPageMetadata({
    locale: locale as Locale,
    title: t("emailVerified"),
    description: t("emailVerifiedSubtitle"),
    path: "/email-verified",
  });
}

export default async function EmailVerifiedPage({ params }: Props) {
  const { locale } = await params;
  ensureRequestLocale(locale);
  const t = await getTranslations("auth");
  return (
    <AuthLayout title={t("emailVerified")} subtitle={t("emailVerifiedSubtitle")}>
      <div className="flex flex-col items-center gap-6 text-center">
        <CheckCircle className="h-16 w-16 text-green-500" />
        <Button asChild>
          <Link href="/sign-in">{t("backToSignIn")}</Link>
        </Button>
      </div>
    </AuthLayout>
  );
}
