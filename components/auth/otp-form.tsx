"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createOtpSchema, type OtpFormData } from "@/features/auth/validation";
import { authService } from "@/services/auth-service";
import { useAuthStore } from "@/store/auth-store";
import {
  getAuthFlow,
  getAuthFlowEmail,
  setResetToken,
} from "@/lib/auth-flow";

export function OtpForm() {
  const t = useTranslations("auth");
  const tv = useTranslations("validation");
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const schema = createOtpSchema((key) => tv(key));
  const purpose = getAuthFlow();
  const flowEmail = getAuthFlowEmail();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OtpFormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: OtpFormData) => {
    try {
      const result = await authService.verifyOtp(
        data.otp,
        purpose,
        purpose === "password_reset" ? flowEmail : undefined
      );

      if (purpose === "email_verification") {
        if (result.user) setUser(result.user);
        toast.success(t("verifyCode"));
        router.push("/email-verified");
        return;
      }

      if (result.resetToken) {
        setResetToken(result.resetToken);
      }
      toast.success(t("verifyCode"));
      router.push("/reset-password");
    } catch (error) {
      const message = error instanceof Error ? error.message : tv("required");
      toast.error(message);
    }
  };

  const resend = async () => {
    try {
      await authService.resendOtp(
        purpose,
        purpose === "password_reset" ? flowEmail : undefined
      );
      toast.success(t("otpSent"));
    } catch (error) {
      const message = error instanceof Error ? error.message : tv("required");
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="otp">OTP</Label>
        <Input
          id="otp"
          inputMode="numeric"
          maxLength={6}
          placeholder="000000"
          className="text-center text-2xl tracking-[0.5em]"
          {...register("otp")}
        />
        {errors.otp && <p className="text-sm text-red-500">{errors.otp.message}</p>}
      </div>
      <Button type="submit" className="w-full" loading={isSubmitting}>
        {t("verifyCode")}
      </Button>
      <Button type="button" variant="ghost" className="w-full" onClick={resend}>
        {t("resendOtp")}
      </Button>
    </form>
  );
}
