"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useResumeStore } from "@/store/resume-store";
import type { ResumeType } from "@/types/resume-builder";

interface ResumeTypeSelectorProps {
  /** Unique id when multiple selectors are mounted (form + preview). */
  instanceId?: string;
  variant?: "default" | "compact";
}

export function ResumeTypeSelector({
  instanceId = "form",
  variant = "default",
}: ResumeTypeSelectorProps) {
  const t = useTranslations("builder.analyzer");
  const resumeType = useResumeStore((s) => s.resume.resumeType ?? "professional");
  const updateResume = useResumeStore((s) => s.updateResume);

  const options: { type: ResumeType; icon: typeof Briefcase; titleKey: string; descKey: string }[] = [
    { type: "professional", icon: Briefcase, titleKey: "professionalTitle", descKey: "professionalDesc" },
    { type: "werkstudent", icon: GraduationCap, titleKey: "werkstudentTitle", descKey: "werkstudentDesc" },
  ];

  if (variant === "compact") {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium text-zinc-500">{t("selectType")}</p>
        <div className="flex gap-2">
          {options.map(({ type, icon: Icon, titleKey }) => {
            const selected = resumeType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => updateResume({ resumeType: type })}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-xs font-medium transition-all",
                  selected
                    ? "border-violet-600 bg-violet-600 text-white shadow-sm"
                    : "border-zinc-200 bg-white text-zinc-600 hover:border-violet-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
                )}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{t(titleKey)}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <motion.div className="rounded-2xl border border-violet-200/60 bg-gradient-to-br from-violet-50/80 to-white/80 p-4 shadow-sm backdrop-blur dark:border-violet-900/40 dark:from-violet-950/30 dark:to-zinc-900/80">
      <p className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">{t("selectType")}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map(({ type, icon: Icon, titleKey, descKey }) => {
          const selected = resumeType === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => updateResume({ resumeType: type })}
              className={cn(
                "relative flex flex-col items-start gap-2 rounded-xl border-2 p-4 text-left transition-all",
                selected
                  ? "border-violet-600 bg-violet-50/80 shadow-md dark:border-violet-500 dark:bg-violet-950/40"
                  : "border-zinc-200 bg-white/60 hover:border-violet-300 dark:border-zinc-700 dark:bg-zinc-900/60"
              )}
            >
              {selected && (
                <motion.span
                  layoutId={`resume-type-indicator-${instanceId}`}
                  className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-xs text-white"
                >
                  ✓
                </motion.span>
              )}
              <Icon className={cn("h-5 w-5", selected ? "text-violet-600" : "text-zinc-500")} />
              <span className="font-semibold text-zinc-900 dark:text-zinc-50">{t(titleKey)}</span>
              <span className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">{t(descKey)}</span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
