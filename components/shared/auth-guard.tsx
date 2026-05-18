"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { useAuth } from "@/hooks/use-auth";
import { AuthLoading } from "@/components/auth/auth-loading";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/sign-in");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <AuthLoading />;
  if (!isAuthenticated) return <AuthLoading />;

  return <>{children}</>;
}
