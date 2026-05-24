"use client";

import { ThemeProvider } from "@/providers/theme-provider";
import { AuthSync } from "@/components/auth/auth-sync";
import { Toaster } from "sonner";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthSync />
      {children}
      <Toaster richColors position="top-right" closeButton />
    </ThemeProvider>
  );
}
