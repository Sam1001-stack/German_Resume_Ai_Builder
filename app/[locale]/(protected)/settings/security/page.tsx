"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { z } from "zod";
import { PageTransition } from "@/components/shared/page-transition";
import { ProfileLayoutShell } from "@/components/profile/profile-layout-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/auth/password-input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { authService } from "@/services/auth-service";

export default function SecuritySettingsPage() {
  const t = useTranslations("profile");
  const ta = useTranslations("auth");
  const tv = useTranslations("validation");

  const schema = z
    .object({
      currentPassword: z.string().min(1, tv("required")),
      newPassword: z.string().min(8, tv("passwordMin")),
      confirmPassword: z.string().min(1, tv("required")),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: tv("passwordMatch"),
      path: ["confirmPassword"],
    });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      await authService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      reset();
      toast.success(t("saveChanges"));
    } catch (error) {
      const message = error instanceof Error ? error.message : tv("required");
      toast.error(message);
    }
  };

  return (
    <PageTransition>
      <ProfileLayoutShell>
        <h1 className="mb-8 text-2xl font-bold">{t("security")}</h1>
        <section className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("changePassword")}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <fieldset className="space-y-2">
                  <Label htmlFor="currentPassword">{ta("password")}</Label>
                  <PasswordInput id="currentPassword" {...register("currentPassword")} />
                  {errors.currentPassword && (
                    <p className="text-sm text-red-500">{errors.currentPassword.message}</p>
                  )}
                </fieldset>
                <fieldset className="space-y-2">
                  <Label htmlFor="newPassword">{ta("password")}</Label>
                  <PasswordInput id="newPassword" {...register("newPassword")} />
                  {errors.newPassword && (
                    <p className="text-sm text-red-500">{errors.newPassword.message}</p>
                  )}
                </fieldset>
                <fieldset className="space-y-2">
                  <Label htmlFor="confirmPassword">{ta("confirmPassword")}</Label>
                  <PasswordInput id="confirmPassword" {...register("confirmPassword")} />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                  )}
                </fieldset>
                <Button type="submit" loading={isSubmitting}>
                  {t("saveChanges")}
                </Button>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t("twoFactor")}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-sm text-zinc-600">{t("twoFactor")}</p>
              <Switch />
            </CardContent>
          </Card>
        </section>
      </ProfileLayoutShell>
    </PageTransition>
  );
}
