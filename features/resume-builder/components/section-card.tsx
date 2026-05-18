"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  title: string;
  icon?: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  onAdd?: () => void;
  addLabel?: string;
  children: React.ReactNode;
  badge?: string;
}

export function SectionCard({
  title,
  icon,
  open,
  onToggle,
  onAdd,
  addLabel,
  children,
  badge,
}: SectionCardProps) {
  return (
    <motion.section
      layout
      className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/60 shadow-sm backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-900/60"
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50"
      >
        <div className="flex items-center gap-3">
          {icon && (
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
              {icon}
            </span>
          )}
          <span className="font-semibold text-zinc-900 dark:text-zinc-50">{title}</span>
          {badge && (
            <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-950 dark:text-violet-300">
              {badge}
            </span>
          )}
        </div>
        <ChevronDown
          className={cn("h-5 w-5 text-zinc-400 transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-4 border-t border-zinc-100 px-4 py-4 dark:border-zinc-800">
              {children}
              {onAdd && (
                <Button type="button" variant="outline" size="sm" onClick={onAdd} className="w-full">
                  <Plus className="h-4 w-4" />
                  {addLabel}
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
