"use client";

import { useEffect, useState } from "react";
import { useResumeStore } from "@/store/resume-store";

export function useResumeHydrated() {
  const [hydrated, setHydrated] = useState(
    () => useResumeStore.persist?.hasHydrated?.() ?? false
  );

  useEffect(() => {
    const unsub = useResumeStore.persist.onFinishHydration(() => setHydrated(true));
    setHydrated(useResumeStore.persist.hasHydrated());
    return unsub;
  }, []);

  return hydrated;
}
