"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  const t = useTranslations("landing");

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <motion.div
        className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-700 px-8 py-16 text-center text-white shadow-2xl shadow-violet-600/25"
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("ctaTitle")}</h2>
        <p className="mx-auto mt-4 max-w-xl text-violet-100">{t("ctaSubtitle")}</p>
        <Button size="lg" variant="secondary" className="mt-8" asChild>
          <Link href="/register">{t("ctaPrimary")}</Link>
        </Button>
      </motion.div>
    </section>
  );
}
