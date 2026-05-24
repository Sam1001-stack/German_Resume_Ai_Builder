"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link, useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ResumeTemplateRenderer } from "@/features/resume-builder/templates/resume-template-renderer";
import {
  TEMPLATE_PRESETS,
  buildPreviewResume,
  type TemplatePreset,
} from "@/features/resume-builder/template-presets";
import { useResumeStore } from "@/store/resume-store";
import type { TemplateId } from "@/types/resume-builder";
import { toast } from "sonner";

function TemplateCard({
  preset,
  index,
  onUse,
}: {
  preset: TemplatePreset;
  index: number;
  onUse: (id: TemplateId, withSample: boolean) => void;
}) {
  const t = useTranslations("builder");
  const preview = buildPreviewResume(preset.id);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
    >
      <motion.div
        className="relative aspect-[3/4] overflow-hidden bg-zinc-100 dark:bg-zinc-950"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="pointer-events-none absolute inset-0 origin-top-left scale-[0.28] p-4"
          whileHover={{ scale: 0.29 }}
          transition={{ duration: 0.2 }}
        >
          <ResumeTemplateRenderer resume={preview} />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/50 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </motion.div>

      <motion.div
        className="flex flex-1 flex-col p-5"
        initial={false}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
            {t(`templates.${preset.labelKey}`)}
          </h3>
          {preset.atsFriendly && (
            <Badge variant="secondary" className="text-[10px] uppercase tracking-wide">
              ATS
            </Badge>
          )}
        </div>
        <p className="mb-4 flex-1 text-sm text-zinc-600 dark:text-zinc-400">
          {t(`templates.${preset.descriptionKey}`)}
        </p>
        <motion.div
          className="flex flex-col gap-2 sm:flex-row"
          initial={{ opacity: 0.95 }}
          whileHover={{ opacity: 1 }}
        >
          <Button className="flex-1" onClick={() => onUse(preset.id, false)}>
            {t("useTemplate")}
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onUse(preset.id, true)}
          >
            <Sparkles className="h-4 w-4" />
            {t("useTemplateSample")}
          </Button>
        </motion.div>
      </motion.div>
    </motion.article>
  );
}

export function TemplateGallery() {
  const t = useTranslations("builder");
  const router = useRouter();
  const applyTemplate = useResumeStore((s) => s.applyTemplate);
  const applyTemplateWithSample = useResumeStore((s) => s.applyTemplateWithSample);

  const handleUse = (templateId: TemplateId, withSample: boolean) => {
    if (withSample) {
      applyTemplateWithSample(templateId);
      toast.success(t("templateSampleLoaded"));
    } else {
      applyTemplate(templateId);
      toast.success(t("templateApplied"));
    }
    router.push("/builder");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-zinc-500">{t("templatesPageHint")}</p>
        <Button variant="outline" asChild>
          <Link href="/builder">{t("openBuilder")}</Link>
        </Button>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPLATE_PRESETS.map((preset, index) => (
          <TemplateCard key={preset.id} preset={preset} index={index} onUse={handleUse} />
        ))}
      </div>
    </motion.div>
  );
}
