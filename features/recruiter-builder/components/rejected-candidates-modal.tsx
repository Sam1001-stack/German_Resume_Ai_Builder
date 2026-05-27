"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AlertTriangle, Download, Eye, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import type { RejectedCandidate } from "@/types/recruitment";
import { cn } from "@/lib/utils";

interface RejectedCandidatesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidates: RejectedCandidate[];
  onDownload: (resumeId: string, fileName: string) => void;
}

function ScoreRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-zinc-600 dark:text-zinc-400">{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <Progress value={value} className="h-1.5" />
    </div>
  );
}

function CandidateDetailBody({
  selected,
  onDownload,
  onClose,
  t,
}: {
  selected: RejectedCandidate;
  onDownload: (resumeId: string, fileName: string) => void;
  onClose: () => void;
  t: ReturnType<typeof useTranslations<"recruiterBuilder">>;
}) {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="pr-8 text-xl">{selected.candidateName}</DialogTitle>
        <DialogDescription className="text-left">
          {selected.resumeFile}
          {selected.currentRole ? ` · ${selected.currentRole}` : ""}
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-wrap gap-2">
        <Badge
          className={cn(
            selected.scanFailed
              ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
              : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
          )}
        >
          {selected.scanFailed ? t("scanFailedBadge") : selected.recommendation}
        </Badge>
        <Badge variant="outline">
          {t("matchScore")}: {selected.matchScore}%
        </Badge>
      </div>

      {selected.summary && (
        <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800/50">
          <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            {selected.summary}
          </p>
        </div>
      )}

      <div className="space-y-2">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-red-600 dark:text-red-400">
          <AlertTriangle className="h-4 w-4" />
          {t("rejectionReasons")}
        </h3>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
          {selected.rejectionReasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{t("loopholes")}</h3>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {selected.loopholes.map((gap) => (
            <li key={gap}>{gap}</li>
          ))}
        </ul>
      </div>

      {!selected.scanFailed && selected.scoreBreakdown && (
        <div className="space-y-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <h3 className="text-sm font-semibold">{t("scoreBreakdown")}</h3>
          <ScoreRow label={t("scoreSkills")} value={selected.scoreBreakdown.skills} />
          <ScoreRow label={t("scoreExperience")} value={selected.scoreBreakdown.experience} />
          <ScoreRow label={t("scoreSummary")} value={selected.scoreBreakdown.summary} />
        </div>
      )}

      <DialogFooter className="gap-2 sm:gap-0">
        {!selected.scanFailed && (
          <Button variant="outline" onClick={() => onDownload(selected.resumeId, selected.resumeFile)}>
            <Download className="mr-2 h-4 w-4" />
            {t("downloadResume")}
          </Button>
        )}
        <Button variant="secondary" onClick={onClose}>
          {t("closeModal")}
        </Button>
      </DialogFooter>
    </>
  );
}

export function RejectedCandidatesModal({
  open,
  onOpenChange,
  candidates,
  onDownload,
}: RejectedCandidatesModalProps) {
  const t = useTranslations("recruiterBuilder");
  const [selected, setSelected] = useState<RejectedCandidate | null>(null);

  const handleListOpenChange = (next: boolean) => {
    if (!next) setSelected(null);
    onOpenChange(next);
  };

  return (
    <>
      <Dialog open={open && !selected} onOpenChange={handleListOpenChange}>
        <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              {t("rejectedListTitle")}
            </DialogTitle>
            <DialogDescription>{t("rejectedDesc")}</DialogDescription>
          </DialogHeader>

          {candidates.length === 0 ? (
            <p className="py-8 text-center text-sm text-zinc-500">{t("noRejected")}</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {candidates.map((c) => (
                <Card
                  key={c.resumeId}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelected(c)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelected(c);
                    }
                  }}
                  className="cursor-pointer border-red-200/60 transition-colors hover:border-red-400 hover:bg-red-50/30 dark:border-red-900/40 dark:hover:bg-red-950/20"
                >
                  <CardContent className="flex items-center justify-between gap-3 p-4">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{c.candidateName}</p>
                      <p className="truncate text-xs text-zinc-500">{c.resumeFile}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Badge variant="outline" className="border-red-300 text-red-700">
                        {c.matchScore}%
                      </Badge>
                      <Eye className="h-4 w-4 text-violet-600" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(selected)} onOpenChange={(next) => !next && setSelected(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          {selected && (
            <CandidateDetailBody
              selected={selected}
              onDownload={onDownload}
              onClose={() => setSelected(null)}
              t={t}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
