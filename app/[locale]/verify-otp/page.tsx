import { getTranslations } from "next-intl/server";
import { AuthLayout } from "@/components/auth/auth-layout";
import { OtpForm } from "@/components/auth/otp-form";
import { createPageMetadata } from "@/lib/seo";
import type { Locale } from "@/config/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });
  return createPageMetadata({
    locale: locale as Locale,
    title: t("verifyOtp"),
    description: t("verifySubtitle"),
    path: "/verify-otp",
  });
}

export default async function VerifyOtpPage() {
  const t = await getTranslations("auth");
  return (
    <AuthLayout title={t("verifyOtp")} subtitle={t("verifySubtitle")}>
      <OtpForm />
    </AuthLayout>
  );
}
