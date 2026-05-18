"use client";

import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";

export function AuthLoading() {
  const t = useTranslations("auth");

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4" role="status">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />
      <p className="text-sm text-zinc-500">{t("loading")}</p>
      <div className="w-full max-w-md space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-3/4" />
      </div>
    </div>
  );
}
