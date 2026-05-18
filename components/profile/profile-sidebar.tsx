"use client";

import { Bell, Lock, Settings, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const links = [
  { href: "/profile", icon: User, key: "title" as const },
  { href: "/profile/edit", icon: User, key: "editProfile" as const },
  { href: "/settings/account", icon: Settings, key: "accountSettings" as const },
  { href: "/settings/security", icon: Lock, key: "security" as const },
  { href: "/settings/notifications", icon: Bell, key: "notifications" as const },
];

export function ProfileSidebar() {
  const t = useTranslations("profile");
  const pathname = usePathname();

  return (
    <nav className="space-y-1" aria-label="Profile navigation">
      {links.map(({ href, icon: Icon, key }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            pathname === href || pathname.startsWith(`${href}/`)
              ? "bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300"
              : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          )}
        >
          <Icon className="h-4 w-4" />
          {t(key)}
        </Link>
      ))}
    </nav>
  );
}
