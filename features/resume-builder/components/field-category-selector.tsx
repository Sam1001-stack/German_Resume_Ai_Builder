"use client";

import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox";
import { useResumeStore } from "@/store/resume-store";
import type { FieldCategory, ItFieldType } from "@/types/resume-builder";

export function FieldCategorySelector() {
  const t = useTranslations("builder.analyzer");
  const fieldCategory = useResumeStore((s) => s.resume.fieldCategory ?? "it");
  const itFieldType = useResumeStore((s) => s.resume.itFieldType ?? "developer");
  const updateResume = useResumeStore((s) => s.updateResume);

  const categoryOptions: { value: FieldCategory; labelKey: "fieldIt" | "fieldOther" }[] = [
    { value: "it", labelKey: "fieldIt" },
    { value: "other", labelKey: "fieldOther" },
  ];

  const itOptions: { value: ItFieldType; labelKey: "itDeveloper" | "itGeneral" }[] = [
    { value: "developer", labelKey: "itDeveloper" },
    { value: "general", labelKey: "itGeneral" },
  ];

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-zinc-800/80 dark:bg-zinc-900/80">
      <p className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
        {t("selectField")}
      </p>
      <div className="flex flex-wrap gap-6">
        {categoryOptions.map(({ value, labelKey }) => (
          <label
            key={value}
            className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300"
          >
            <Checkbox
              checked={fieldCategory === value}
              onCheckedChange={(checked) => {
                if (!checked) return;
                updateResume({
                  fieldCategory: value,
                  itFieldType: value === "it" ? itFieldType ?? "developer" : null,
                });
              }}
            />
            <span>{t(labelKey)}</span>
          </label>
        ))}
      </div>

      {fieldCategory === "it" && (
        <div className="mt-4 border-t border-zinc-200/80 pt-4 dark:border-zinc-700/80">
          <p className="mb-3 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {t("selectItType")}
          </p>
          <div className="flex flex-wrap gap-6">
            {itOptions.map(({ value, labelKey }) => (
              <label
                key={value}
                className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300"
              >
                <Checkbox
                  checked={itFieldType === value}
                  onCheckedChange={(checked) => {
                    if (checked) updateResume({ itFieldType: value });
                  }}
                />
                <span>{t(labelKey)}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
