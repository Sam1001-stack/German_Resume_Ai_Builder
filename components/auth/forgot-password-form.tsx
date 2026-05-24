"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createForgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/features/auth/validation";
import { authService } from "@/services/auth-service";
import { setAuthFlow } from "@/lib/auth-flow";

export function ForgotPasswordForm() {
  const t = useTranslations("auth");
  const tv = useTranslations("validation");
  const router = useRouter();
  const schema = createForgotPasswordSchema((key) => tv(key));

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await authService.forgotPassword(data.email);
      setAuthFlow("password_reset", data.email);
      toast.success(t("otpSent"));
      router.push("/verify-otp");
    } catch (error) {
      const message = error instanceof Error ? error.message : tv("required");
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="email">{t("email")}</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>
      <Button type="submit" className="w-full" loading={isSubmitting}>
        {t("sendResetLink")}
      </Button>
      <p className="text-center text-sm">
        <Link href="/sign-in" className="text-violet-600 hover:underline">
          {t("backToSignIn")}
        </Link>
      </p>
    </form>
  );
}
