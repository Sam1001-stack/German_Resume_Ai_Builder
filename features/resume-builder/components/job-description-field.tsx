"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AiButton } from "./ai-button";
import { useAiGeneration } from "@/hooks/use-ai-generation";
import { useResumeStore } from "@/store/resume-store";

export function JobDescriptionField() {
  const t = useTranslations("builder");
  const jobDescription = useResumeStore((s) => s.jobDescription);
  const setJobDescription = useResumeStore((s) => s.setJobDescription);
  const { generate, isGenerating } = useAiGeneration();

  const handleSearchWithAi = async () => {
    if (!jobDescription.trim()) {
      toast.error(t("jobDescriptionRequired"));
      return;
    }

    await generate("improve");
    toast.success(t("searchWithAiSuccess"));
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
        />
        <AiButton
          label={t("searchWithAi")}
          onClick={handleSearchWithAi}
          loading={isGenerating}
          className="mb-0.5 shrink-0 whitespace-nowrap"
        />
      </div>
    </div>
  );
}
