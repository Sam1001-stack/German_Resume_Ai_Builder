"use client";

import { useMemo } from "react";
import { analyzeResume } from "@/features/resume-builder/analyzer/analyze-resume";
import { useResumeStore } from "@/store/resume-store";

export function useResumeAnalysis() {
  const resume = useResumeStore((s) => s.resume);

  return useMemo(() => analyzeResume(resume), [resume]);
}
