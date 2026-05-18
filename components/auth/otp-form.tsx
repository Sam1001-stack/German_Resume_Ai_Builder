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

export function OtpForm() {
  const t = useTranslations("auth");
  const tv = useTranslations("validation");
  const router = useRouter();
  const schema = createOtpSchema((key) => tv(key));

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OtpFormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: OtpFormData) => {
    await authService.verifyOtp(data.otp);
    toast.success(t("verifyCode"));
    router.push("/reset-password");
  };

  const resend = async () => {
    await authService.forgotPassword("");
    toast.success(t("otpSent"));
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
