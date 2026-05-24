"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/auth/password-input";
import {
  createResetPasswordSchema,
  type ResetPasswordFormData,
} from "@/features/auth/validation";
import { authService } from "@/services/auth-service";
import { clearAuthFlow, getResetToken } from "@/lib/auth-flow";

export function ResetPasswordForm() {
  const t = useTranslations("auth");
  const tv = useTranslations("validation");
  const router = useRouter();
  const schema = createResetPasswordSchema((key) => tv(key));

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: ResetPasswordFormData) => {
    const resetToken = getResetToken();
    if (!resetToken) {
      toast.error(t("forgotLink"));
      router.push("/forgot-password");
      return;
    }

    try {
      await authService.resetPassword(data.password, resetToken);
      clearAuthFlow();
      toast.success(t("resetSuccess"));
      router.push("/sign-in");
    } catch (error) {
      const message = error instanceof Error ? error.message : tv("required");
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="password">{t("password")}</Label>
        <PasswordInput id="password" {...register("password")} />
        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
        <PasswordInput id="confirmPassword" {...register("confirmPassword")} />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full" loading={isSubmitting}>
        {t("updatePassword")}
      </Button>
      <p className="text-center text-sm">
        <Link href="/sign-in" className="text-violet-600 hover:underline">
          {t("backToSignIn")}
        </Link>
      </p>
    </form>
  );
}
