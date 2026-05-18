"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Logo } from "@/components/shared/logo";
import { SocialLinks } from "@/components/shared/social-links";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const [email, setEmail] = useState("");
  const year = new Date().getFullYear();

  const quickLinks = [
    { href: "/features", label: tNav("features") },
    { href: "/pricing", label: tNav("pricing") },
    { href: "/templates", label: tNav("templates") },
    { href: "/contact", label: tNav("contact") },
  ];

  const resources = [
    { href: "/faq", label: t("faq") },
    { href: "/careers", label: t("careers") },
    { href: "/contact", label: tNav("contact") },
  ];

  const legal = [
    { href: "/privacy", label: t("privacy") },
    { href: "/terms", label: t("terms") },
    { href: "/cookies", label: t("cookies") },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success(t("subscribed"));
    setEmail("");
  };

  return (
    <footer className="border-t border-zinc-200/80 bg-zinc-50 dark:border-zinc-800/80 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {t("description")}
            </p>
            <SocialLinks className="mt-6" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {t("quickLinks")}
            </h3>
            <ul className="mt-4 space-y-2">
              {quickLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-zinc-600 transition-colors hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {t("resources")}
            </h3>
            <ul className="mt-4 space-y-2">
              {resources.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-zinc-600 transition-colors hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{t("legal")}</h3>
            <ul className="mt-4 space-y-2">
              {legal.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-zinc-600 transition-colors hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-zinc-200/80 bg-white/60 p-6 backdrop-blur dark:border-zinc-800/80 dark:bg-zinc-900/60">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{t("newsletter")}</h3>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{t("newsletterDesc")}</p>
          <form onSubmit={handleSubscribe} className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Input
              type="email"
              placeholder={t("emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
              aria-label={t("emailPlaceholder")}
            />
            <Button type="submit">{t("subscribe")}</Button>
          </form>
        </div>

        <p className="mt-10 text-center text-sm text-zinc-500">
          {t("copyright", { year })}
        </p>
      </div>
    </footer>
  );
}
