"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { SocialLinks } from "@/components/shared/social-links";
import type { NavItem } from "@/constants/nav";

interface MobileNavProps {
  navItems: NavItem[];
  isActive: (href: string) => boolean;
  isAuthenticated: boolean;
  onClose: () => void;
}

export function MobileNav({ navItems, isActive, isAuthenticated, onClose }: MobileNavProps) {
  const t = useTranslations("nav");

  return (
    <nav
      className="border-t border-zinc-200/50 bg-white/95 px-4 py-4 backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-950/95 lg:hidden"
      aria-label="Mobile"
    >
      <div className="flex flex-col gap-1">
        {navItems.map(({ href, key }) => (
          <Link
            key={key}
            href={href}
            onClick={onClose}
            className={cn(
              "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive(href)
                ? "bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400"
                : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            )}
          >
            {t(key)}
          </Link>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-4 dark:border-zinc-800">
        <SocialLinks />
        <div className="flex gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        {isAuthenticated ? (
          <Button asChild onClick={onClose}>
            <Link href="/dashboard">{t("dashboard")}</Link>
          </Button>
        ) : (
          <>
            <Button variant="outline" asChild onClick={onClose}>
              <Link href="/sign-in">{t("signIn")}</Link>
            </Button>
            <Button asChild onClick={onClose}>
              <Link href="/register">{t("getStarted")}</Link>
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}
