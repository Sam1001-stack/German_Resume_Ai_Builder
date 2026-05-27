"use client";

import { useEffect, useState } from "react";
import { useResumeStore } from "@/store/resume-store";

export function useResumeHydrated() {
  const [hydrated, setHydrated] = useState(
    () => useResumeStore.persist?.hasHydrated?.() ?? false
  );

  useEffect(() => {
    return useResumeStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  return hydrated;
}
