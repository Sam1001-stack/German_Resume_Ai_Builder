"use client";

import { useTranslations } from "next-intl";
import { Briefcase, Users } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { RecruiterDashboard } from "./recruiter-dashboard";

export function RecruiterBuilderShell() {
  const t = useTranslations("recruiterBuilder");
  const { user, isAuthenticated } = useAuth();
  const isRecruiter = user?.role === "recruiter" || user?.role === "admin";

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 dark:bg-violet-950/50">
          <Briefcase className="h-7 w-7 text-violet-600 dark:text-violet-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{t("pageTitle")}</h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">{t("signInPrompt")}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/sign-in">{t("signIn")}</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/register">{t("registerAsRecruiter")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!isRecruiter) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-950/40">
          <Users className="h-7 w-7 text-amber-600 dark:text-amber-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{t("recruiterOnlyTitle")}</h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">{t("recruiterOnlyDesc")}</p>
        <Button className="mt-8" asChild>
          <Link href="/builder">{t("goToResumeBuilder")}</Link>
        </Button>
      </div>
    );
  }

  return <RecruiterDashboard />;
}
