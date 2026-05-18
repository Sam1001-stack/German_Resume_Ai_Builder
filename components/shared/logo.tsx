import { Sparkles } from "lucide-react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={cn("group flex items-center gap-2", className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30 transition-transform group-hover:scale-105">
        <Sparkles className="h-5 w-5" aria-hidden />
      </span>
      <span className="text-lg font-bold tracking-tight">
        Resume<span className="text-violet-600 dark:text-violet-400">AI</span>
      </span>
    </Link>
  );
}
