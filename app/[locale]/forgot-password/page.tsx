import { getTranslations } from "next-intl/server";
import { AuthLayout } from "@/components/auth/auth-layout";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { createPageMetadata } from "@/lib/seo";
import type { Locale } from "@/config/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });
  return createPageMetadata({
    locale: locale as Locale,
    title: t("forgotPassword"),
    description: t("forgotSubtitle"),
    path: "/forgot-password",
  });
}

export default async function ForgotPasswordPage() {
  const t = await getTranslations("auth");
  return (
    <AuthLayout title={t("forgotPassword")} subtitle={t("forgotSubtitle")}>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
