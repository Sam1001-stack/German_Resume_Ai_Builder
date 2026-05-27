"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ResumeUploaderProps {
  onUpload: (files: File[]) => Promise<void>;
  disabled?: boolean;
}

export function ResumeUploader({ onUpload, disabled }: ResumeUploaderProps) {
  const t = useTranslations("recruiterBuilder");
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFiles = useCallback(
    async (fileList: FileList | null) => {
      if (!fileList?.length || disabled) return;
      const pdfs = Array.from(fileList).filter(
        (f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
      );
      if (!pdfs.length) return;
      setUploading(true);
      try {
        await onUpload(pdfs);
      } finally {
        setUploading(false);
      }
    },
    [disabled, onUpload]
  );

  return (
    <div
      className={cn(
        "rounded-xl border-2 border-dashed p-8 text-center transition-colors",
        dragOver
          ? "border-violet-500 bg-violet-50/50 dark:bg-violet-950/30"
          : "border-zinc-300 dark:border-zinc-700",
        disabled && "pointer-events-none opacity-50"
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        void handleFiles(e.dataTransfer.files);
      }}
    >
      <Upload className="mx-auto h-10 w-10 text-violet-600" />
      <p className="mt-3 font-medium">{t("dropResumes")}</p>
      <p className="mt-1 text-sm text-zinc-500">{t("dropResumesHint")}</p>
      <Button variant="outline" className="mt-4" loading={uploading} asChild>
        <label className="cursor-pointer">
          {t("browsePdf")}
          <input
            type="file"
            accept="application/pdf,.pdf"
            multiple
            className="sr-only"
            disabled={disabled || uploading}
            onChange={(e) => void handleFiles(e.target.files)}
          />
        </label>
      </Button>
    </div>
  );
}
