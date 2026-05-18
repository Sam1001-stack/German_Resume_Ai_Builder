"use client";

import { useTranslations } from "next-intl";
import { PageTransition } from "@/components/shared/page-transition";
import { ProfileLayoutShell } from "@/components/profile/profile-layout-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/auth/password-input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function SecuritySettingsPage() {
  const t = useTranslations("profile");

  return (
    <PageTransition>
      <ProfileLayoutShell>
        <h1 className="mb-8 text-2xl font-bold">{t("security")}</h1>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("changePassword")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t("changePassword")}</Label>
                <PasswordInput />
              </div>
              <Button>{t("saveChanges")}</Button>
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
        </div>
      </ProfileLayoutShell>
    </PageTransition>
  );
}
