import { getTranslations } from "next-intl/server";
import { AuthLayout } from "@/components/auth/auth-layout";
import { RegisterForm } from "@/components/auth/register-form";
import { createPageMetadata } from "@/lib/seo";
import { ensureRequestLocale } from "@/lib/ensure-locale";
import type { Locale } from "@/config/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });
  return createPageMetadata({
    locale: locale as Locale,
    title: t("register"),
    description: t("registerSubtitle"),
    path: "/register",
  });
}

export default async function RegisterPage({ params }: Props) {
  const { locale } = await params;
  ensureRequestLocale(locale);
  const t = await getTranslations("auth");
  return (
    <AuthLayout title={t("register")} subtitle={t("registerSubtitle")}>
      <RegisterForm />
    </AuthLayout>
  );
}
