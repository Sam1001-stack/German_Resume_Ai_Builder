"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { SocialLinks } from "@/components/shared/social-links";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { HeaderUserMenu } from "@/components/layout/header-user-menu";
import dynamic from "next/dynamic";

const MobileNav = dynamic(
  () => import("@/components/layout/mobile-nav").then((m) => m.MobileNav),
  { ssr: false }
);

const navItems = [
  { href: "/", key: "home" as const },
  { href: "/builder", key: "builder" as const },
  { href: "/features", key: "features" as const },
  { href: "/pricing", key: "pricing" as const },
  { href: "/templates", key: "templates" as const },
  { href: "/contact", key: "contact" as const },
];

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/50 bg-white/70 backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-950/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {navItems.map(({ href, key }) => (
            <Link
              key={key}
              href={href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800",
                isActive(href)
                  ? "text-violet-600 dark:text-violet-400"
                  : "text-zinc-600 dark:text-zinc-400"
              )}
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-1 md:flex">
          <SocialLinks className="hidden xl:flex" />
          <LanguageSwitcher />
          <ThemeToggle />
          {isAuthenticated ? (
            <HeaderUserMenu />
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/sign-in">{t("signIn")}</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">{t("getStarted")}</Link>
              </Button>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileOpen && (
        <MobileNav
          navItems={navItems}
          isActive={isActive}
          isAuthenticated={isAuthenticated}
          onClose={() => setMobileOpen(false)}
        />
      )}
    </header>
  );
}
