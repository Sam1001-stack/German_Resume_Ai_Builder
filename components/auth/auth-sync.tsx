"use client";

import { useEffect } from "react";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import { getAuthCookieToken, setAuthCookie } from "@/lib/auth-cookie";
import { useAuthStore } from "@/store/auth-store";

/** Keeps resumeai-token cookie in sync with the persisted auth store. */
export function AuthSync() {
  const hydrated = useAuthHydrated();

  useEffect(() => {
    if (!hydrated) return;
    const token = useAuthStore.getState().token;
    if (token && !getAuthCookieToken()) {
      setAuthCookie(token, true);
    }
  }, [hydrated]);

  return null;
}
