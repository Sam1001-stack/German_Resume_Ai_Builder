"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Mail, MapPin, Pencil, Phone, ShieldCheck, User } from "lucide-react";

function formatMemberSince(date: string | undefined, locale: string) {
  if (!date) return "—";
  return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(
    new Date(date)
  );
}

export function UserProfileCard() {
  const t = useTranslations("profile");
  const tNav = useTranslations("nav");
  const locale = useLocale();
  const { user } = useAuth();

  const initials = user
    ? `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase()
    : "U";

  return (
    <Card className="overflow-hidden border-violet-200/60 bg-gradient-to-br from-violet-50/80 via-white to-white dark:border-violet-900/40 dark:from-violet-950/30 dark:via-zinc-950 dark:to-zinc-950">
      <CardContent className="p-6 sm:p-8">
        <section className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Avatar className="h-20 w-20 border-2 border-white shadow-md dark:border-zinc-800">
              {user?.avatar && <AvatarImage src={user.avatar} alt="" />}
              <AvatarFallback className="bg-violet-100 text-xl text-violet-700 dark:bg-violet-950 dark:text-violet-300">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium text-violet-600 dark:text-violet-400">
                  {t("welcomeBack")}
                </p>
                <h2 className="text-2xl font-bold tracking-tight">
                  {user ? `${user.firstName} ${user.lastName}` : t("title")}
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-4 w-4" />
                  {user?.email ?? "—"}
                </span>
                {user?.phone && (
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="h-4 w-4" />
                    {user.phone}
                  </span>
                )}
                {user?.location && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {user.location}
                  </span>
                )}
              </div>
              {user?.bio && (
                <p className="max-w-xl text-sm text-zinc-600 dark:text-zinc-400">{user.bio}</p>
              )}
              <div className="flex flex-wrap gap-2">
                <Badge>{t("active")}</Badge>
                <Badge variant={user?.emailVerified ? "default" : "secondary"}>
                  {user?.emailVerified ? (
                    <span className="inline-flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" />
                      {t("verified")}
                    </span>
                  ) : (
                    t("pendingVerification")
                  )}
                </Badge>
              </div>
              <p className="text-xs text-zinc-500">
                {t("memberSince")}: {formatMemberSince(user?.createdAt, locale)}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link href="/profile">
                <User className="h-4 w-4" />
                {tNav("profile")}
              </Link>
            </Button>
            <Button asChild size="sm" className="gap-2">
              <Link href="/profile/edit">
                <Pencil className="h-4 w-4" />
                {t("editProfile")}
              </Link>
            </Button>
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
