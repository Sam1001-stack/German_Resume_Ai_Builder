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

  const canFetch = hydrated && isAuthenticated;

  const refresh = useCallback(async () => {
    if (!canFetch) return;

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
  }, [canFetch]);

  useEffect(() => {
    if (!canFetch) return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await userResumeService.getAll();
        if (!cancelled) setServerResumes(data);
      } catch (err) {
        if (!cancelled) {
          setServerResumes([]);
          setError(err instanceof Error ? err.message : "Failed to load resumes");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [canFetch]);

  return {
    serverResumes: canFetch ? serverResumes : [],
    loading: canFetch ? loading : false,
    error: canFetch ? error : null,
    refresh,
    isAuthenticated,
  };
}
