"use client";

import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "sonner";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {children}
      <Toaster richColors position="top-right" closeButton />
    </ThemeProvider>
  );
}
