"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Shield,
  Target,
  TrendingUp,
  Wrench,
  Briefcase,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useResumeAnalysis } from "@/hooks/use-resume-analysis";
import type { ValidationStatus } from "@/types/resume-analyzer";
import { cn } from "@/lib/utils";

const STATUS_ICON: Record<ValidationStatus, typeof CheckCircle2> = {
  pass: CheckCircle2,
  warning: AlertTriangle,
  fail: XCircle,
};

const STATUS_STYLE: Record<ValidationStatus, string> = {
  pass: "text-emerald-600 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-400",
  fail: "text-red-600 dark:text-red-400",
};

function ScoreCard({
  label,
  value,
  icon: Icon,
  delay,
}: {
  label: string;
  value: number;
  icon: typeof Target;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-xl border border-zinc-200 bg-white/80 p-3 dark:border-zinc-800 dark:bg-zinc-900/80"
    >
      <div className="mb-1 flex items-center justify-between text-xs font-medium">
        <span className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
          <Icon className="h-3.5 w-3.5" />
          {label}
        </span>
        <span className="font-semibold text-violet-600">{value}%</span>
      </div>
      <Progress value={value} className="h-1.5" />
    </motion.div>
  );
}

export function AtsAnalyzerPanel() {
  const t = useTranslations("builder.analyzer");
  const report = useResumeAnalysis();

  const passedChecks = useMemo(
    () => report.sections.flatMap((s) => s.checks.filter((c) => c.status === "pass")),
    [report]
  );

  return (
    <aside className="flex w-80 shrink-0 flex-col gap-3 overflow-hidden border-l border-zinc-200/80 bg-white/40 backdrop-blur-xl xl:flex dark:border-zinc-800/80 dark:bg-zinc-950/40">
      <div className="shrink-0 border-b border-zinc-200/80 p-4 dark:border-zinc-800/80">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          <Shield className="h-4 w-4 text-violet-600" />
          {t("title")}
        </h3>
        <p className="mt-1 text-xs text-zinc-500">{t("subtitle")}</p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4 pt-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border border-violet-200/50 bg-violet-50/50 p-3 dark:border-violet-900/30 dark:bg-violet-950/20"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-violet-700 dark:text-violet-300">
            {t("verdictLabel")}
          </p>
          <p className="mt-1 text-sm font-semibold leading-snug text-zinc-900 dark:text-zinc-50">
            {t(report.verdictKey)}
          </p>
          <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
            {report.resumeType === "werkstudent" ? t("modeWerkstudent") : t("modeProfessional")}
          </p>
        </motion.div>

        <ScoreCard label={t("atsScore")} value={report.scores.ats} icon={Target} delay={0.05} />
        <ScoreCard label={t("germanHrScore")} value={report.scores.germanHr} icon={Briefcase} delay={0.1} />
        <ScoreCard label={t("technicalScore")} value={report.scores.technical} icon={Wrench} delay={0.15} />
        <ScoreCard
          label={t("hiringScore")}
          value={report.scores.hiringReadiness}
          icon={TrendingUp}
          delay={0.2}
        />

        {report.missingKeywords.length > 0 && (
          <div className="rounded-xl border border-amber-200/60 bg-amber-50/50 p-3 dark:border-amber-900/40 dark:bg-amber-950/20">
            <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">{t("missingKeywords")}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {report.missingKeywords.map((kw) => (
                <span
                  key={kw}
                  className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {passedChecks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-emerald-200/50 bg-emerald-50/30 p-3 dark:border-emerald-900/30 dark:bg-emerald-950/20"
          >
            <p className="mb-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300">{t("strengths")}</p>
            <ul className="space-y-1">
              {passedChecks.slice(0, 5).map((c) => (
                <li key={c.id} className="flex gap-1.5 text-[11px] text-emerald-800 dark:text-emerald-400">
                  <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0" />
                  {t(c.messageKey)}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {report.sections.map((section, si) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * si }}
            className="rounded-xl border border-zinc-200 bg-white/80 p-3 dark:border-zinc-800 dark:bg-zinc-900/80"
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{t(section.titleKey)}</p>
              <span
                className={cn(
                  "text-xs font-bold",
                  section.score >= 80
                    ? "text-emerald-600"
                    : section.score >= 50
                      ? "text-amber-600"
                      : "text-red-600"
                )}
              >
                {section.score}%
              </span>
            </div>
            <ul className="space-y-2">
              {section.checks.map((c) => {
                const Icon = STATUS_ICON[c.status];
                return (
                  <li key={c.id} className="text-[11px] leading-relaxed">
                    <div className="flex gap-1.5">
                      <Icon className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", STATUS_STYLE[c.status])} />
                      <div>
                        <p className="text-zinc-700 dark:text-zinc-300">{t(c.messageKey)}</p>
                        {c.suggestionKey && c.status !== "pass" && (
                          <p className="mt-0.5 text-zinc-500">{t(c.suggestionKey)}</p>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        ))}

        <div className="rounded-xl border border-zinc-200 bg-white/80 p-3 dark:border-zinc-800 dark:bg-zinc-900/80">
          <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{t("atsTipsTitle")}</p>
          <ul className="mt-2 space-y-1">
            {report.atsTips.map((tip) => (
              <li key={tip} className="text-[11px] text-zinc-600 dark:text-zinc-400">
                • {t(tip)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
