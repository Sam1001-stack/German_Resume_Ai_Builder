"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AiButton } from "./ai-button";
import { aiService } from "@/services/ai-service";
import { distributeSkillsToDeveloperGroups } from "@/features/resume-builder/constants/developer-skills";
import {
  getDeveloperSkillGroups,
  isDeveloperSkillsMode,
  withSyncedDeveloperSkills,
} from "@/features/resume-builder/utils/developer-skills-mode";
import { useResumeStore } from "@/store/resume-store";
import type { ResumeDocument } from "@/types/resume-builder";

export function JobDescriptionField() {
  const t = useTranslations("builder");
  const locale = useLocale() as "en" | "de";
  const jobDescription = useResumeStore((s) => s.jobDescription);
  const resume = useResumeStore((s) => s.resume);
  const setJobDescription = useResumeStore((s) => s.setJobDescription);
  const updateResume = useResumeStore((s) => s.updateResume);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchWithAi = async () => {
    if (!jobDescription.trim()) {
      toast.error(t("jobDescriptionRequired"));
      return;
    }

    const developerMode = isDeveloperSkillsMode(resume);
    const currentSkills = developerMode
      ? withSyncedDeveloperSkills(getDeveloperSkillGroups(resume)).skills
      : resume.skills;

    setIsSearching(true);
    try {
      const { data } = await aiService.tailorFromJobDescription({
        jobDescription: jobDescription.trim(),
        locale,
        resumeType: resume.resumeType ?? "professional",
        headline: resume.personal.headline || undefined,
        currentSummary: resume.summary || undefined,
        currentSkills: currentSkills.length ? currentSkills : undefined,
        fieldCategory: resume.fieldCategory,
        itFieldType: resume.itFieldType ?? undefined,
      });

      const patch: Partial<ResumeDocument> = {
        summary: data.summary,
      };

      if (developerMode) {
        const developerSkills =
          data.developerSkills ?? distributeSkillsToDeveloperGroups(data.skills);
        Object.assign(patch, withSyncedDeveloperSkills(developerSkills));
      } else {
        patch.skills = data.skills;
      }

      updateResume(patch);
      toast.success(t("searchWithAiSuccess"));
    } catch (error) {
      const message = error instanceof Error ? error.message : t("searchWithAiError");
      toast.error(message);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="mt-3">
      <Label
        htmlFor="job-description"
        className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400"
      >
        {t("jobDescription")}
      </Label>
      <div className="flex items-end gap-2">
        <Textarea
          id="job-description"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder={t("jobDescriptionPlaceholder")}
          rows={3}
          className="min-h-[72px] flex-1 resize-y text-xs"
          disabled={isSearching}
        />
        <AiButton
          label={t("searchWithAi")}
          onClick={handleSearchWithAi}
          loading={isSearching}
          className="mb-0.5 shrink-0 whitespace-nowrap"
        />
      </div>
    </div>
  );
}
