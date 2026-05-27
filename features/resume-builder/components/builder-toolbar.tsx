"use client";

import { useTranslations } from "next-intl";
import {
  Download,
  FileText,
  Link2,
  Mail,
  Printer,
  Redo2,
  Save,
  Share2,
  Undo2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useResumeStore } from "@/store/resume-store";
import { TEMPLATE_OPTIONS } from "@/features/resume-builder/constants";
import { useResumeSaveActions } from "@/hooks/use-resume-save-actions";
import { toast } from "sonner";

export function BuilderToolbar() {
  const t = useTranslations("builder");
  const resume = useResumeStore((s) => s.resume);
  const updateResume = useResumeStore((s) => s.updateResume);
  const setTemplate = useResumeStore((s) => s.setTemplate);
  const autosaveStatus = useResumeStore((s) => s.autosaveStatus);
  const completion = useResumeStore((s) => s.getCompletion());
  const undo = useResumeStore((s) => s.undo);
  const redo = useResumeStore((s) => s.redo);
  const canUndo = useResumeStore((s) => s.canUndo);
  const canRedo = useResumeStore((s) => s.canRedo);
  const saveToLibrary = useResumeStore((s) => s.saveToLibrary);
  const { handleSave, handleDownloadPdf, handleDownloadCoverLetter, isSaving, isDownloading } = useResumeSaveActions();

  const exportToast = (type: string) => toast.success(t("exportStarted", { type }));

  return (
    <div className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/70 px-4 py-3 backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/70">
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1">
          <input
            value={resume.title}
            onChange={(e) => updateResume({ title: e.target.value })}
            className="w-full max-w-xs truncate bg-transparent text-lg font-semibold text-zinc-900 outline-none focus:ring-0 dark:text-zinc-50"
          />
          <div className="mt-1 flex items-center gap-2">
            <Progress value={completion} className="h-1.5 max-w-[120px]" />
            <span className="text-xs text-zinc-500">
              {completion}% ·{" "}
              {autosaveStatus === "saving" ? t("saving") : t("saved")}
            </span>
          </div>
        </div>

        <Select value={resume.templateId} onValueChange={(v) => setTemplate(v as typeof resume.templateId)}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder={t("template")} />
          </SelectTrigger>
          <SelectContent>
            {TEMPLATE_OPTIONS.map((opt) => (
              <SelectItem key={opt.id} value={opt.id}>
                {t(`templates.${opt.labelKey}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" disabled={!canUndo()} onClick={undo} aria-label={t("undo")}>
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" disabled={!canRedo()} onClick={redo} aria-label={t("redo")}>
            <Redo2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleSave} loading={isSaving} disabled={isSaving}>
            <Save className="h-4 w-4" />
            {t("save")}
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-1 border-l border-zinc-200 pl-2 dark:border-zinc-800">
          <Button variant="outline" size="sm" onClick={handleDownloadPdf} loading={isDownloading} disabled={isDownloading}>
            <Download className="h-4 w-4" />
            PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadCoverLetter}
            loading={isDownloading}
            disabled={isDownloading}
          >
            <Mail className="h-4 w-4" />
            {t("coverLetter")}
          </Button>
          <Button variant="outline" size="sm" onClick={() => exportToast("DOCX")}>
            <FileText className="h-4 w-4" />
            DOCX
          </Button>
          <Button variant="outline" size="sm" onClick={() => exportToast("Link")}>
            <Link2 className="h-4 w-4" />
            {t("share")}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => window.print()} aria-label={t("print")}>
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => exportToast("Share")} aria-label={t("share")}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
