"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AiButtonProps {
  label: string;
  onClick: () => void;
  loading?: boolean;
  className?: string;
}

export function AiButton({ label, onClick, loading, className }: AiButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      loading={loading}
      onClick={onClick}
      className={cn(
        "border-violet-200 bg-violet-50/50 text-violet-700 hover:bg-violet-100 dark:border-violet-800 dark:bg-violet-950/30 dark:text-violet-300",
        className
      )}
    >
      {!loading && <Sparkles className="h-3.5 w-3.5" />}
      {label}
    </Button>
  );
}
