"use client";

import { useEffect } from "react";
import { authService } from "@/services/auth-service";
import { useAuthStore } from "@/store/auth-store";

export function useProfileSync() {
  const setUser = useAuthStore((s) => s.setUser);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) return;

    authService
      .getProfile()
      .then(setUser)
      .catch(() => {
        /* keep cached user on fetch failure */
      });
  }, [isAuthenticated, setUser]);
}
