"use client";

import { useTranslations } from "next-intl";
import { PageTransition } from "@/components/shared/page-transition";
import { ProfileLayoutShell } from "@/components/profile/profile-layout-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const prefs = ["emailNotifications", "pushNotifications", "marketingEmails"] as const;

export default function NotificationSettingsPage() {
  const t = useTranslations("profile");

  return (
    <PageTransition>
      <ProfileLayoutShell>
        <h1 className="mb-8 text-2xl font-bold">{t("notifications")}</h1>
        <Card>
          <CardHeader>
            <CardTitle>{t("notifications")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {prefs.map((key) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm font-medium">{t(key)}</span>
                <Switch defaultChecked={key !== "marketingEmails"} />
              </div>
            ))}
          </CardContent>
        </Card>
      </ProfileLayoutShell>
    </PageTransition>
  );
}
