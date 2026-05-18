"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Lightbulb, Target, TrendingUp, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useResumeStore } from "@/store/resume-store";
import { calculateAtsScore } from "@/features/resume-builder/utils/completion";

const SUGGESTED_SKILLS = ["TypeScript", "Docker", "Kubernetes", "CI/CD", "Leadership"];

export function AiSuggestionsPanel() {
  const t = useTranslations("builder");
  const resume = useResumeStore((s) => s.resume);
  const completion = useResumeStore((s) => s.getCompletion());
  const atsScore = calculateAtsScore(resume);
  const missingSkills = SUGGESTED_SKILLS.filter((s) => !resume.skills.includes(s)).slice(0, 4);

  return (
    <aside className="hidden w-72 shrink-0 flex-col gap-4 border-l border-zinc-200/80 bg-white/40 p-4 backdrop-blur-xl xl:flex dark:border-zinc-800/80 dark:bg-zinc-950/40">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
        <Zap className="h-4 w-4 text-violet-600" />
        {t("aiSuggestions")}
      </h3>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-zinc-200 bg-white/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/80"
      >
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="flex items-center gap-1.5 text-zinc-600">
            <Target className="h-3.5 w-3.5" />
            {t("atsScore")}
          </span>
          <span className="text-violet-600">{atsScore}%</span>
        </div>
        <Progress value={atsScore} className="mt-2" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-xl border border-zinc-200 bg-white/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/80"
      >
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="flex items-center gap-1.5 text-zinc-600">
            <TrendingUp className="h-3.5 w-3.5" />
            {t("strengthMeter")}
          </span>
          <span>{completion}%</span>
        </div>
        <Progress value={completion} className="mt-2" />
      </motion.div>

      {missingSkills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-violet-200/60 bg-violet-50/50 p-4 dark:border-violet-900/40 dark:bg-violet-950/20"
        >
          <p className="flex items-center gap-1.5 text-xs font-semibold text-violet-800 dark:text-violet-300">
            <Lightbulb className="h-3.5 w-3.5" />
            {t("missingSkills")}
          </p>
          <ul className="mt-2 space-y-1">
            {missingSkills.map((skill) => (
              <li key={skill} className="text-xs text-violet-700 dark:text-violet-400">
                + {skill}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-xl border border-zinc-200 bg-white/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/80"
      >
        <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{t("keywordTips")}</p>
        <p className="mt-1 text-xs leading-relaxed text-zinc-500">{t("keywordTipsDesc")}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-zinc-200 bg-white/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/80"
      >
        <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{t("experienceTips")}</p>
        <p className="mt-1 text-xs leading-relaxed text-zinc-500">{t("experienceTipsDesc")}</p>
      </motion.div>
    </aside>
  );
}
