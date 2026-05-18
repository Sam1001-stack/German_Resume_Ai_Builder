"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, label, error, id, value, defaultValue, ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
    const stringValue = value === undefined || value === null ? "" : String(value);

    return (
      <div className="relative w-full">
        <input
          {...props}
          ref={ref}
          id={inputId}
          value={stringValue}
          defaultValue={defaultValue}
          placeholder=" "
          className={cn(
            "peer block h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 pb-2 pt-6 text-sm font-normal text-zinc-900 shadow-sm",
            "placeholder:text-transparent",
            "focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            className
          )}
        />
        <label
          htmlFor={inputId}
          className={cn(
            "pointer-events-none absolute left-4 z-[1] origin-left text-zinc-500 transition-all duration-200",
            "top-1/2 -translate-y-1/2 text-sm",
            "peer-focus:top-2.5 peer-focus:-translate-y-0 peer-focus:text-xs peer-focus:font-medium peer-focus:text-violet-600",
            "peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:-translate-y-0",
            "peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:font-medium",
            "peer-[:not(:placeholder-shown)]:text-violet-600",
            "dark:peer-focus:text-violet-400 dark:peer-[:not(:placeholder-shown)]:text-violet-400"
          )}
        >
          {label}
        </label>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
FloatingInput.displayName = "FloatingInput";
