"use client";

import { useTranslations } from "next-intl";
import { PageTransition } from "@/components/shared/page-transition";
import { StatsCards } from "@/components/profile/stats-cards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { DashboardResumes } from "@/features/resume-builder/components/dashboard-resumes";

export default function DashboardPage() {
  const t = useTranslations("profile");
  const tNav = useTranslations("nav");
  const { user } = useAuth();

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {tNav("dashboard")}
          {user ? `, ${user.firstName}` : ""}
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">{t("stats")}</p>

        <div className="mt-8">
          <StatsCards />
        </div>

        <div className="mt-10">
          <DashboardResumes />
        </div>

        <div className="mt-10">
          <Card>
            <CardHeader>
              <CardTitle>{t("activity")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4 border-l-2 border-violet-200 pl-4 dark:border-violet-900">
                <li className="text-sm">
                  <span className="font-medium">Resume created</span>
                  <span className="block text-zinc-500">2 hours ago</span>
                </li>
                <li className="text-sm">
                  <span className="font-medium">Template saved</span>
                  <span className="block text-zinc-500">Yesterday</span>
                </li>
                <li className="text-sm">
                  <span className="font-medium">PDF downloaded</span>
                  <span className="block text-zinc-500">3 days ago</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
