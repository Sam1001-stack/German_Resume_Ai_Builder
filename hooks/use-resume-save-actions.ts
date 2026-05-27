"use client";

import { useCallback, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "@/i18n/routing";
import { useAuth } from "@/hooks/use-auth";
import { userResumeService } from "@/services/user-resume-service";
import { useResumeStore } from "@/store/resume-store";
import type { ResumeDocument } from "@/types/resume-builder";

function mergeServerId(resume: ResumeDocument, serverId: string): ResumeDocument {
  return { ...resume, serverId, updatedAt: new Date().toISOString() };
}

export function useResumeSaveActions() {
  const t = useTranslations("builder");
  const locale = useLocale() as "en" | "de";
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const resume = useResumeStore((s) => s.resume);
  const jobDescription = useResumeStore((s) => s.jobDescription);
  const saveToLibrary = useResumeStore((s) => s.saveToLibrary);
  const setResume = useResumeStore((s) => s.setResume);
  const updateResume = useResumeStore((s) => s.updateResume);
  const [isSaving, setIsSaving] = useState(false);

  const persistToServer = useCallback(async () => {
    const { data } = await userResumeService.save({
      locale,
      content: resume,
      jobDescription: jobDescription?.trim() ? jobDescription : undefined,
    });
    const next = mergeServerId(resume, data._id);
    setResume(next, false);
    saveToLibrary();
    return data._id;
  }, [locale, resume, jobDescription, saveToLibrary, setResume]);

  const handleSave = useCallback(async () => {
    saveToLibrary();

    if (!isAuthenticated) {
      toast.error(t("loginToSaveResume"));
      router.push("/sign-in");
      return;
    }

    setIsSaving(true);
    try {
      const serverId = await persistToServer();
      toast.success(t("resumeSaved"));

      // Auto-download resume PDF after save.
      try {
        await userResumeService.downloadPdf(serverId, resume.title);
        toast.success(t("pdfDownloaded"));
      } catch (error) {
        const message = error instanceof Error ? error.message : t("pdfDownloadFailed");
        toast.error(message);
      }

      // Auto-download cover letter PDF after save (only meaningful if a job description exists).
      if (jobDescription?.trim()) {
        try {
          await userResumeService.downloadCoverLetterPdf(serverId, `${resume.title} - Cover Letter`);
          toast.success(t("coverLetterDownloaded"));
        } catch (error) {
          const message =
            error instanceof Error ? error.message : t("coverLetterDownloadFailed");
          toast.error(message);
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : t("resumeSaveFailed");
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  }, [isAuthenticated, persistToServer, router, saveToLibrary, t, resume.title, jobDescription]);

  return { handleSave, isSaving };
}
