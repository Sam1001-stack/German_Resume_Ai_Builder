"use client";

import { useTranslations } from "next-intl";
import { PageTransition } from "@/components/shared/page-transition";
import { StatsCards } from "@/components/profile/stats-cards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { FileText } from "lucide-react";

export default function DashboardPage() {
  const t = useTranslations("profile");
  const tNav = useTranslations("nav");
  const { user } = useAuth();

  const recentResumes = [
    { title: "Software Engineer CV", date: "2026-05-15" },
    { title: "Lebenslauf — Marketing", date: "2026-05-10" },
    { title: "Product Manager Resume", date: "2026-05-01" },
  ];

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

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("recentResumes")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentResumes.map((r) => (
                <div
                  key={r.title}
                  className="flex items-center gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
                >
                  <FileText className="h-5 w-5 text-violet-600" />
                  <div>
                    <p className="font-medium">{r.title}</p>
                    <p className="text-xs text-zinc-500">{r.date}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
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
