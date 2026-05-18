"use client";

import { useTranslations } from "next-intl";
import { PageTransition } from "@/components/shared/page-transition";
import { ProfileLayoutShell } from "@/components/profile/profile-layout-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function AccountSettingsPage() {
  const t = useTranslations("profile");
  const { user } = useAuth();

  return (
    <PageTransition>
      <ProfileLayoutShell>
        <h1 className="mb-8 text-2xl font-bold">{t("accountSettings")}</h1>
        <Card>
          <CardHeader>
            <CardTitle>{t("accountStatus")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input defaultValue={user?.email} disabled />
            </div>
            <Button>{t("saveChanges")}</Button>
          </CardContent>
        </Card>
      </ProfileLayoutShell>
    </PageTransition>
  );
}
