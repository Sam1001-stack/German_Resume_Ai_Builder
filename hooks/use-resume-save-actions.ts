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
  const saveToLibrary = useResumeStore((s) => s.saveToLibrary);
  const setResume = useResumeStore((s) => s.setResume);
  const updateResume = useResumeStore((s) => s.updateResume);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const persistToServer = useCallback(async () => {
    const { data } = await userResumeService.save({ locale, content: resume });
    const next = mergeServerId(resume, data._id);
    setResume(next, false);
    saveToLibrary();
    return data._id;
  }, [locale, resume, saveToLibrary, setResume]);

  const handleSave = useCallback(async () => {
    saveToLibrary();

    if (!isAuthenticated) {
      toast.error(t("loginToSaveResume"));
      router.push("/sign-in");
      return;
    }

    setIsSaving(true);
    try {
      await persistToServer();
      toast.success(t("resumeSaved"));
    } catch (error) {
      const message = error instanceof Error ? error.message : t("resumeSaveFailed");
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  }, [isAuthenticated, persistToServer, router, saveToLibrary, t]);

  const handleDownloadPdf = useCallback(async () => {
    if (!isAuthenticated) {
      toast.error(t("loginToSaveResume"));
      router.push("/sign-in");
      return;
    }

    setIsDownloading(true);
    try {
      let serverId = resume.serverId;
      if (!serverId) {
        serverId = await persistToServer();
      }
      await userResumeService.downloadPdf(serverId, resume.title);
      toast.success(t("pdfDownloaded"));
    } catch (error) {
      const message = error instanceof Error ? error.message : t("pdfDownloadFailed");
      toast.error(message);
    } finally {
      setIsDownloading(false);
    }
  }, [isAuthenticated, persistToServer, resume.serverId, resume.title, router, t]);

  return { handleSave, handleDownloadPdf, isSaving, isDownloading };
}
