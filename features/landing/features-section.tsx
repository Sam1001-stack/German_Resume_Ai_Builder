"use client";

import { motion } from "framer-motion";
import { Bot, FileCheck, Globe, LayoutTemplate } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const icons = [Bot, FileCheck, LayoutTemplate, Globe];

export function FeaturesSection() {
  const t = useTranslations("landing");
  const keys = ["feature1", "feature2", "feature3", "feature4"] as const;

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("featuresTitle")}</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">{t("featuresSubtitle")}</p>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {keys.map((key, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{t(`${key}Title`)}</CardTitle>
                    <CardDescription>{t(`${key}Desc`)}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
