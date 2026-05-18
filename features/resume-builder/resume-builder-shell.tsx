"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, PanelLeftClose } from "lucide-react";
import { BuilderToolbar } from "./components/builder-toolbar";
import { ResumeFormSections } from "./components/resume-form-sections";
import { ResumeTypeSelector } from "./components/resume-type-selector";
import { ResumeTemplateRenderer } from "./templates/resume-template-renderer";
import { AtsAnalyzerPanel } from "./components/ats-analyzer-panel";
import { useResumeStore } from "@/store/resume-store";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { Logo } from "@/components/shared/logo";
import { Link } from "@/i18n/routing";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { Button } from "@/components/ui/button";

export function ResumeBuilderShell() {
  const t = useTranslations("builder");
  const resume = useResumeStore((s) => s.resume);
  const saveToLibrary = useResumeStore((s) => s.saveToLibrary);
  const undo = useResumeStore((s) => s.undo);
  const redo = useResumeStore((s) => s.redo);
  const [mobilePreview, setMobilePreview] = useState(false);

  useKeyboardShortcuts({ onUndo: undo, onRedo: redo, onSave: saveToLibrary });

  useEffect(() => {
    const timer = setInterval(() => saveToLibrary(), 15000);
    return () => clearInterval(timer);
  }, [saveToLibrary]);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-zinc-50 via-white to-violet-50/30 dark:from-zinc-950 dark:via-zinc-950 dark:to-violet-950/20">
      <header className="flex h-14 items-center justify-between border-b border-zinc-200/80 bg-white/60 px-4 backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/60">
        <Logo />
        <nav className="hidden items-center gap-4 text-sm md:flex">
          <Link href="/dashboard" className="text-zinc-600 hover:text-violet-600 dark:text-zinc-400">
            {t("nav.dashboard")}
          </Link>
          <Link href="/templates" className="text-zinc-600 hover:text-violet-600 dark:text-zinc-400">
            {t("nav.templates")}
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={() => setMobilePreview(!mobilePreview)}
          >
            <Eye className="h-4 w-4" />
            {t("preview")}
          </Button>
        </div>
      </header>

      <BuilderToolbar />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
          <div className="flex-1 overflow-y-auto border-r border-zinc-200/80 p-4 dark:border-zinc-800/80 lg:max-w-xl xl:max-w-2xl">
            <ResumeFormSections />
          </div>

          <div className="hidden flex-1 flex-col overflow-hidden bg-zinc-100/50 dark:bg-zinc-900/50 lg:flex">
            <div className="border-b border-zinc-200/80 px-4 py-3 dark:border-zinc-800/80">
              <span className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                {t("livePreview")}
              </span>
              <ResumeTypeSelector instanceId="preview" variant="compact" />
            </div>
            <div className="flex-1 overflow-auto p-6">
              <div className="mx-auto origin-top scale-[0.55] xl:scale-[0.65] 2xl:scale-75">
                <ResumeTemplateRenderer resume={resume} />
              </div>
            </div>
          </div>
        </div>

        <AtsAnalyzerPanel />
      </div>

      <AnimatePresence>
        {mobilePreview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-50 flex flex-col bg-zinc-950/90 p-4 lg:hidden"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="font-medium text-white">{t("livePreview")}</span>
              <Button variant="ghost" size="icon" onClick={() => setMobilePreview(false)}>
                <PanelLeftClose className="h-5 w-5 text-white" />
              </Button>
            </div>
            <div className="flex-1 overflow-auto rounded-xl bg-zinc-100 p-4">
              <div className="origin-top scale-[0.45]">
                <ResumeTemplateRenderer resume={resume} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
