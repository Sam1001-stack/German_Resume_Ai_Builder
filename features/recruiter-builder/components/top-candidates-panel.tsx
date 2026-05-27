"use client";

import { useTranslations } from "next-intl";
import { Download, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { TopCandidate } from "@/types/recruitment";
import { cn } from "@/lib/utils";

interface TopCandidatesPanelProps {
  candidates: TopCandidate[];
  onDownload: (resumeId: string, fileName: string) => void;
}

function recommendationColor(rec: string) {
  if (rec.includes("Highly")) return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300";
  if (rec.includes("Recommended") && !rec.includes("Highly"))
    return "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300";
  if (rec.includes("Consider")) return "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300";
  return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";
}

export function TopCandidatesPanel({ candidates, onDownload }: TopCandidatesPanelProps) {
  const t = useTranslations("recruiterBuilder");

  if (!candidates.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("shortlistedCandidates")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-zinc-500">{t("noCandidatesYet")}</p>
        </CardContent>
      </Card>
    );
  }

  const sorted = [...candidates].sort((a, b) => {
    const order = (rec: string) => {
      if (rec.includes("Highly")) return 0;
      if (rec === "Recommended") return 1;
      if (rec === "Consider") return 2;
      return 3;
    };
    const byRec = order(a.recommendation) - order(b.recommendation);
    if (byRec !== 0) return byRec;
    return b.matchScore - a.matchScore;
  });

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">{t("shortlistedCandidates")}</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{t("shortlistedDesc")}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {sorted.map((c, idx) => (
          <Card key={c.resumeId} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700 dark:bg-violet-950 dark:text-violet-300">
                      #{idx + 1}
                    </span>
                    <CardTitle className="text-base">{c.candidateName}</CardTitle>
                  </div>
                  <p className="mt-1 text-sm text-zinc-500">{c.currentRole || c.email}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-2xl font-bold text-violet-600">
                    <Star className="h-5 w-5 fill-violet-600" />
                    {c.matchScore}
                  </div>
                  <p className="text-xs text-zinc-500">{t("matchScore")}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Progress value={c.matchScore} className="h-2" />
              <Badge className={cn("text-xs", recommendationColor(c.recommendation))}>
                {c.recommendation}
              </Badge>
              <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">{c.summary}</p>
              {c.skillsMatched.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {c.skillsMatched.slice(0, 6).map((s) => (
                    <Badge key={s} variant="secondary" className="text-xs">
                      {s}
                    </Badge>
                  ))}
                </div>
              )}
              {c.missingSkills.length > 0 && (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  {t("missing")}: {c.missingSkills.slice(0, 4).join(", ")}
                </p>
              )}
              <div className="flex gap-2 pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDownload(c.resumeId, c.resumeFile)}
                >
                  <Download className="mr-1 h-3 w-3" />
                  {t("downloadResume")}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
