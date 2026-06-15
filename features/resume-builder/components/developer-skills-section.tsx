"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useResumeStore } from "@/store/resume-store";
import {
  DEVELOPER_SKILL_CATEGORIES,
  getAllCategorySuggestions,
  isStackHighlight,
} from "@/features/resume-builder/constants/developer-skills";
import {
  getDeveloperSkillGroups,
  withSyncedDeveloperSkills,
} from "@/features/resume-builder/utils/developer-skills-mode";
import type { DeveloperSkillCategoryId, DeveloperSkillGroups } from "@/types/resume-builder";

const categoryStyles: Record<
  DeveloperSkillCategoryId,
  { border: string; chip: string; stackChip: string; stackButton: string }
> = {
  backend: {
    border: "border-sky-200 dark:border-sky-900/50",
    chip: "bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-200",
    stackChip: "bg-sky-600 text-white ring-2 ring-sky-300 dark:ring-sky-700",
    stackButton:
      "border-sky-400 bg-sky-50 text-sky-800 hover:border-sky-500 dark:border-sky-600 dark:bg-sky-950/60 dark:text-sky-200",
  },
  frontend: {
    border: "border-violet-200 dark:border-violet-900/50",
    chip: "bg-violet-100 text-violet-900 dark:bg-violet-950 dark:text-violet-200",
    stackChip: "bg-violet-600 text-white ring-2 ring-violet-300 dark:ring-violet-700",
    stackButton:
      "border-violet-400 bg-violet-50 text-violet-800 hover:border-violet-500 dark:border-violet-600 dark:bg-violet-950/60 dark:text-violet-200",
  },
  devops: {
    border: "border-amber-200 dark:border-amber-900/50",
    chip: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
    stackChip: "bg-amber-600 text-white ring-2 ring-amber-300 dark:ring-amber-700",
    stackButton:
      "border-amber-400 bg-amber-50 text-amber-900 hover:border-amber-500 dark:border-amber-600 dark:bg-amber-950/60 dark:text-amber-200",
  },
};

const categoryLabelKeys = {
  backend: "skillBackend",
  frontend: "skillFrontend",
  devops: "skillDevops",
} as const;

const stackLabelKeys = {
  backend: "skillFrameworks",
  frontend: "skillFrameworks",
  devops: "skillStack",
} as const;

export function DeveloperSkillsSection() {
  const t = useTranslations("builder");
  const groups = useResumeStore((s) => getDeveloperSkillGroups(s.resume));
  const updateResume = useResumeStore((s) => s.updateResume);

  const updateCategory = (
    categoryId: DeveloperSkillCategoryId,
    nextCategorySkills: string[]
  ) => {
    const nextGroups: DeveloperSkillGroups = {
      ...groups,
      [categoryId]: nextCategorySkills,
    };
    updateResume(withSyncedDeveloperSkills(nextGroups));
  };

  const addSkill = (categoryId: DeveloperSkillCategoryId, skill: string) => {
    if (groups[categoryId].includes(skill)) return;
    updateCategory(categoryId, [...groups[categoryId], skill]);
  };

  const removeSkill = (categoryId: DeveloperSkillCategoryId, skill: string) => {
    updateCategory(
      categoryId,
      groups[categoryId].filter((item) => item !== skill)
    );
  };

  return (
    <div className="space-y-4">
      {DEVELOPER_SKILL_CATEGORIES.map((category) => {
        const styles = categoryStyles[category.id];
        const selected = groups[category.id];
        const suggestions = getAllCategorySuggestions(category.id).filter(
          (skill) => !selected.includes(skill)
        );

        return (
          <div
            key={category.id}
            className={cn("rounded-xl border p-3", styles.border)}
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {t(categoryLabelKeys[category.id])}
              </p>
              <span className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">
                {t(stackLabelKeys[category.id])}
              </span>
            </div>

            {selected.length > 0 ? (
              <div className="mb-3 flex flex-wrap gap-2">
                {selected.map((skill) => {
                  const highlighted = isStackHighlight(category.id, skill);
                  return (
                    <span
                      key={skill}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium",
                        highlighted ? styles.stackChip : styles.chip
                      )}
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(category.id, skill)}
                        className="hover:opacity-70"
                        aria-label={`Remove ${skill}`}
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            ) : (
              <p className="mb-3 text-xs text-zinc-500">{t("skillsCategoryEmpty")}</p>
            )}

            <div className="flex flex-wrap gap-1.5">
              {suggestions.map((skill) => {
                const highlighted = isStackHighlight(category.id, skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => addSkill(category.id, skill)}
                    className={cn(
                      "rounded-lg border px-2 py-1 text-xs transition-colors",
                      highlighted
                        ? styles.stackButton
                        : "border-dashed border-zinc-300 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400"
                    )}
                  >
                    + {skill}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
