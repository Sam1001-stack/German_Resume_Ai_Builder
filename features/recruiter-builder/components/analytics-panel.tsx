"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardAnalytics } from "@/types/recruitment";
import { cn } from "@/lib/utils";

interface AnalyticsPanelProps {
  analytics: DashboardAnalytics;
  rejectedCount: number;
  onRejectedClick: () => void;
}

export function AnalyticsPanel({
  analytics,
  rejectedCount,
  onRejectedClick,
}: AnalyticsPanelProps) {
  const t = useTranslations("recruiterBuilder");

  const topSkills = Object.entries(analytics.skillDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const statCardClass =
    "rounded-xl border border-zinc-200/80 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950";

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className={statCardClass}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">{t("totalResumes")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{analytics.totalResumes}</p>
          </CardContent>
        </Card>
        <Card className={statCardClass}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">{t("analyzed")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{analytics.analyzedResumes}</p>
          </CardContent>
        </Card>
        <Card className={statCardClass}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">{t("avgScore")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{analytics.averageScore}%</p>
          </CardContent>
        </Card>
        <Card
          role="button"
          tabIndex={0}
          onClick={onRejectedClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onRejectedClick();
            }
          }}
          className={cn(
            statCardClass,
            "cursor-pointer border-red-200/80 transition-all hover:border-red-400 hover:shadow-md",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:border-red-900/50"
          )}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600 dark:text-red-400">
              {t("rejectedCandidates")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">{rejectedCount}</p>
            <p className="mt-1 text-xs text-zinc-500">{t("rejectedCardHint")}</p>
          </CardContent>
        </Card>
      </div>

      {topSkills.length > 0 && (
        <Card className={statCardClass}>
          <CardHeader>
            <CardTitle className="text-sm">{t("skillDistribution")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {topSkills.map(([skill, count]) => (
                <span
                  key={skill}
                  className="rounded-lg bg-zinc-100 px-3 py-1 text-sm dark:bg-zinc-800"
                >
                  {skill} <span className="text-zinc-500">({count})</span>
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
