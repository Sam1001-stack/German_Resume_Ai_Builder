"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { isTemplateId } from "@/features/resume-builder/template-presets";
import { useResumeHydrated } from "@/hooks/use-resume-hydrated";
import { useResumeStore } from "@/store/resume-store";

export function useBuilderTemplateQuery() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const hydrated = useResumeHydrated();
  const applied = useRef(false);

  useEffect(() => {
    if (!hydrated || applied.current) return;

    const template = searchParams.get("template");
    if (!template || !isTemplateId(template)) return;

    applied.current = true;
    const withSample = searchParams.get("sample") === "1";
    const store = useResumeStore.getState();

    if (withSample) {
      store.applyTemplateWithSample(template);
    } else {
      store.applyTemplate(template);
    }

    router.replace("/builder");
  }, [hydrated, router, searchParams]);
}
