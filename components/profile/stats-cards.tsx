"use client";

import { Download, FileText, LayoutTemplate } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  { key: "totalResumes" as const, value: "12", icon: FileText },
  { key: "templatesUsed" as const, value: "5", icon: LayoutTemplate },
  { key: "downloads" as const, value: "28", icon: Download },
];

export function StatsCards() {
  const t = useTranslations("profile");

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map(({ key, value, icon: Icon }) => (
        <Card key={key}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">{t(key)}</CardTitle>
            <Icon className="h-4 w-4 text-violet-600" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
