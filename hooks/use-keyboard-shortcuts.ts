"use client";

import { useEffect } from "react";

interface ShortcutHandlers {
  onUndo?: () => void;
  onRedo?: () => void;
  onSave?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;

      if (e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        handlers.onUndo?.();
      }
      if ((e.key === "z" && e.shiftKey) || e.key === "y") {
        e.preventDefault();
        handlers.onRedo?.();
      }
      if (e.key === "s") {
        e.preventDefault();
        handlers.onSave?.();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handlers]);
}
