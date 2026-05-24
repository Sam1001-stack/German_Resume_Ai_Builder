"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import { userResumeService, type SavedUserResume } from "@/services/user-resume-service";

export function useUserResumes() {
  const hydrated = useAuthHydrated();
  const { isAuthenticated } = useAuth();
  const [serverResumes, setServerResumes] = useState<SavedUserResume[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!hydrated || !isAuthenticated) {
      setServerResumes([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data } = await userResumeService.getAll();
      setServerResumes(data);
    } catch (err) {
      setServerResumes([]);
      setError(err instanceof Error ? err.message : "Failed to load resumes");
    } finally {
      setLoading(false);
    }
  }, [hydrated, isAuthenticated]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { serverResumes, loading, error, refresh, isAuthenticated };
}
