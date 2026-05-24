"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { useAuth } from "@/hooks/use-auth";
import { useAuthHydrated } from "@/hooks/use-auth-hydrated";
import { AuthLoading } from "@/components/auth/auth-loading";
import { authService } from "@/services/auth-service";
import { clearAuthCookie, getAuthCookieToken, setAuthCookie } from "@/lib/auth-cookie";
import { useAuthStore } from "@/store/auth-store";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const hydrated = useAuthHydrated();
  const { isAuthenticated, login } = useAuth();
  const router = useRouter();
  const [restoring, setRestoring] = useState(false);
  const restoreAttempted = useRef(false);

  useEffect(() => {
    if (!hydrated || isAuthenticated || restoreAttempted.current) return;

    const cookieToken = getAuthCookieToken();
    const storeToken = useAuthStore.getState().token;
    const token = cookieToken ?? storeToken;

    if (!token) return;

    if (!cookieToken && storeToken) {
      setAuthCookie(storeToken, true);
    }

    restoreAttempted.current = true;
    setRestoring(true);
    useAuthStore.getState().setToken(token);

    authService
      .getProfile()
      .then((user) => login(user, token))
      .catch(() => {
        clearAuthCookie();
        useAuthStore.getState().logout();
      })
      .finally(() => setRestoring(false));
  }, [hydrated, isAuthenticated, login]);

  useEffect(() => {
    if (!hydrated || restoring) return;
    const hasSession =
      isAuthenticated || Boolean(getAuthCookieToken()) || Boolean(useAuthStore.getState().token);
    if (!hasSession) {
      router.replace("/sign-in");
    }
  }, [hydrated, isAuthenticated, restoring, router]);

  if (!hydrated || restoring) return <AuthLoading />;
  if (!isAuthenticated) return <AuthLoading />;

  return <>{children}</>;
}
