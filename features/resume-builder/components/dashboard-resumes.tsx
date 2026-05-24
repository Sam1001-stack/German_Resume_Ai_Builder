"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Copy, Download, FileText, Plus, Trash2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useResumeStore } from "@/store/resume-store";
import { useUserResumes } from "@/hooks/use-user-resumes";
import { userResumeService } from "@/services/user-resume-service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createEmptyResume } from "@/features/resume-builder/default-resume";
import { Progress } from "@/components/ui/progress";
import { calculateCompletion } from "@/features/resume-builder/utils/completion";
import { mapSavedUserResume } from "@/features/resume-builder/utils/normalize-resume";
import { toast } from "sonner";
import type { ResumeDocument } from "@/types/resume-builder";

export function DashboardResumes() {
  const t = useTranslations("builder");
  const tCommon = useTranslations("common");
  const { serverResumes, loading, error, refresh, isAuthenticated } = useUserResumes();
  const savedResumes = useResumeStore((s) => s.savedResumes);
  const setResume = useResumeStore((s) => s.setResume);
  const duplicateResume = useResumeStore((s) => s.duplicateResume);
  const deleteResume = useResumeStore((s) => s.deleteResume);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; serverId?: string } | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const displayResumes: ResumeDocument[] = isAuthenticated
    ? serverResumes.length > 0
      ? serverResumes.map(mapSavedUserResume)
      : savedResumes
    : savedResumes;

  const handleCreate = () => {
    const resume = createEmptyResume();
    setResume(resume);
    toast.success(t("createResume"));
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.serverId && isAuthenticated) {
        await userResumeService.delete(deleteTarget.serverId);
        await refresh();
      } else {
        deleteResume(deleteTarget.id);
      }
      setDeleteTarget(null);
      toast.success(t("deleteResume"));
    } catch (error) {
      const message = error instanceof Error ? error.message : t("resumeSaveFailed");
      toast.error(message);
    }
  };

  const handleDownload = async (resume: ResumeDocument) => {
    if (!resume.serverId) return;
    setDownloadingId(resume.serverId);
    try {
      await userResumeService.downloadPdf(resume.serverId, resume.title);
      toast.success(t("pdfDownloaded"));
    } catch (error) {
      const message = error instanceof Error ? error.message : t("pdfDownloadFailed");
      toast.error(message);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleLoad = (resume: ResumeDocument) => {
    setResume(resume, false);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-sm text-zinc-500">{t("loadingResumes")}</CardContent>
      </Card>
    );
  }

  if (error && isAuthenticated && displayResumes.length === 0) {
    return (
      <Card className="border-dashed border-red-200 dark:border-red-900/40">
        <CardContent className="flex flex-col items-center justify-center gap-4 py-12 text-center">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          <Button variant="outline" onClick={() => void refresh()}>
            {tCommon("retry")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (displayResumes.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <FileText className="h-12 w-12 text-violet-400" />
          <h3 className="mt-4 text-lg font-semibold">{t("emptyResumes")}</h3>
          <p className="mt-2 max-w-sm text-sm text-zinc-500">{t("emptyResumesDesc")}</p>
          <Button className="mt-6" onClick={handleCreate} asChild>
            <Link href="/builder">
              <Plus className="h-4 w-4" />
              {t("createResume")}
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t("recentlyEdited")}</h2>
        <Button onClick={handleCreate} asChild>
          <Link href="/builder">
            <Plus className="h-4 w-4" />
            {t("createResume")}
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {displayResumes.map((resume, i) => {
          const completion = calculateCompletion(resume);
          return (
            <motion.div
              key={resume.serverId ?? resume.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-1 text-base">{resume.title}</CardTitle>
                  <p className="text-xs text-zinc-500">
                    {new Date(resume.updatedAt).toLocaleDateString()}
                    {resume.serverId ? ` · ${t("savedToCloud")}` : ""}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="mb-1 flex justify-between text-xs">
                      <span>{t("strengthMeter")}</span>
                      <span>{completion}%</span>
                    </div>
                    <Progress value={completion} className="h-1.5" />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleLoad(resume)}
                      asChild
                    >
                      <Link href="/builder">{tCommon("edit")}</Link>
                    </Button>
                    {resume.serverId && (
                      <Button
                        size="sm"
                        variant="outline"
                        loading={downloadingId === resume.serverId}
                        onClick={() => handleDownload(resume)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    {!isAuthenticated && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          duplicateResume(resume.id);
                          toast.success(t("duplicate"));
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setDeleteTarget({ id: resume.id, serverId: resume.serverId })
                      }
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("deleteResume")}</DialogTitle>
            <DialogDescription>{t("deleteConfirm")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              {tCommon("cancel")}
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              {t("deleteResume")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
