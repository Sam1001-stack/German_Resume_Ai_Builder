"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Copy, FileText, Plus, Trash2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useResumeStore } from "@/store/resume-store";
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
import { toast } from "sonner";

export function DashboardResumes() {
  const t = useTranslations("builder");
  const tCommon = useTranslations("common");
  const savedResumes = useResumeStore((s) => s.savedResumes);
  const loadResume = useResumeStore((s) => s.loadResume);
  const setResume = useResumeStore((s) => s.setResume);
  const duplicateResume = useResumeStore((s) => s.duplicateResume);
  const deleteResume = useResumeStore((s) => s.deleteResume);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleCreate = () => {
    const resume = createEmptyResume();
    setResume(resume);
    toast.success(t("createResume"));
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteResume(deleteId);
      setDeleteId(null);
      toast.success(t("deleteResume"));
    }
  };

  if (savedResumes.length === 0) {
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
        {savedResumes.map((resume, i) => {
          const completion = calculateCompletion(resume);
          return (
            <motion.div
              key={resume.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-1 text-base">{resume.title}</CardTitle>
                  <p className="text-xs text-zinc-500">
                    {new Date(resume.updatedAt).toLocaleDateString()}
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
                      onClick={() => {
                        loadResume(resume.id);
                      }}
                      asChild
                    >
                      <Link href="/builder">{tCommon("edit")}</Link>
                    </Button>
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
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDeleteId(resume.id)}
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

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("deleteResume")}</DialogTitle>
            <DialogDescription>{t("deleteConfirm")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
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

