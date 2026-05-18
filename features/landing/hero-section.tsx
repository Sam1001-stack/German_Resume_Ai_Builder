"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  const t = useTranslations("landing");

  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pt-24">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-violet-500/20 blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-[300px] w-[300px] rounded-full bg-indigo-500/15 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Badge variant="secondary" className="mb-6 gap-1">
            <Sparkles className="h-3 w-3" />
            {t("badge")}
          </Badge>
        </motion.div>
        <motion.h1
          className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl dark:text-zinc-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {t("heroTitle")}
        </motion.h1>
        <motion.p
          className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {t("heroSubtitle")}
        </motion.p>
        <motion.div
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button size="lg" asChild>
            <Link href="/builder">
              {t("ctaPrimary")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/templates">{t("ctaSecondary")}</Link>
          </Button>
        </motion.div>
        <p className="mt-8 text-sm text-zinc-500">{t("trustedBy")}</p>
      </div>
    </section>
  );
}
