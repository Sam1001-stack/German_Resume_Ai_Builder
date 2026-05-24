"use client";

import { useTranslations } from "next-intl";
import { PageTransition } from "@/components/shared/page-transition";
import { ProfileLayoutShell } from "@/components/profile/profile-layout-shell";
import { StatsCards } from "@/components/profile/stats-cards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useProfileSync } from "@/hooks/use-profile-sync";

export default function ProfilePage() {
  const t = useTranslations("profile");
  const { user } = useAuth();
  useProfileSync();
  const initials = user
    ? `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase()
    : "U";

  return (
    <PageTransition>
      <ProfileLayoutShell>
        <div className="space-y-8">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Avatar className="h-20 w-20">
              {user?.avatar && <AvatarImage src={user.avatar} alt="" />}
              <AvatarFallback className="text-xl">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-zinc-500">{user?.email}</p>
              {(user?.phone || user?.location) && (
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                  {user.phone && (
                    <span className="inline-flex items-center gap-1.5">
                      <Phone className="h-4 w-4" />
                      {user.phone}
                    </span>
                  )}
                  {user.location && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {user.location}
                    </span>
                  )}
                </div>
              )}
              {user?.bio && (
                <p className="mt-3 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
                  {user.bio}
                </p>
              )}
              <div className="mt-2 flex gap-2">
                <Badge>{t("active")}</Badge>
                <Badge variant="secondary">
                  {user?.emailVerified ? t("verified") : t("active")}
                </Badge>
              </div>
            </div>
          </div>
          <StatsCards />
          <Card>
            <CardHeader>
              <CardTitle>{t("savedTemplates")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                {["Modern", "Classic DE", "Minimal"].map((name) => (
                  <div
                    key={name}
                    className="h-32 rounded-xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-zinc-100 p-4 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-800"
                  >
                    <p className="font-medium">{name}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </ProfileLayoutShell>
    </PageTransition>
  );
}
