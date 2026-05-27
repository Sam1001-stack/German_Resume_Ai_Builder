"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Briefcase,
  FileSearch,
  Plus,
  Sparkles,
  Users,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface JobPosting {
  id: string;
  title: string;
  company: string;
  description: string;
  createdAt: string;
}

export function RecruiterBuilderShell() {
  const t = useTranslations("recruiterBuilder");
  const { user, isAuthenticated } = useAuth();
  const isRecruiter = user?.role === "recruiter" || user?.role === "admin";

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [postings, setPostings] = useState<JobPosting[]>([]);

  const handleCreatePosting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !company.trim() || description.trim().length < 20) {
      toast.error(t("formValidation"));
      return;
    }
    setPostings((prev) => [
      {
        id: crypto.randomUUID(),
        title: title.trim(),
        company: company.trim(),
        description: description.trim(),
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setTitle("");
    setCompany("");
    setDescription("");
    toast.success(t("postingCreated"));
  };

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 dark:bg-violet-950/50">
          <Briefcase className="h-7 w-7 text-violet-600 dark:text-violet-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{t("pageTitle")}</h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">{t("signInPrompt")}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/sign-in">{t("signIn")}</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/register">{t("registerAsRecruiter")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!isRecruiter) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-950/40">
          <Users className="h-7 w-7 text-amber-600 dark:text-amber-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{t("recruiterOnlyTitle")}</h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">{t("recruiterOnlyDesc")}</p>
        <Button className="mt-8" asChild>
          <Link href="/builder">{t("goToResumeBuilder")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10">
        <Badge variant="secondary" className="mb-3">
          {t("badge")}
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("pageTitle")}</h1>
        <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">{t("pageSubtitle")}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Plus className="h-5 w-5 text-violet-600" />
              {t("newPosting")}
            </CardTitle>
            <CardDescription>{t("newPostingDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreatePosting} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="job-title">{t("jobTitle")}</Label>
                <Input
                  id="job-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("jobTitlePlaceholder")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">{t("company")}</Label>
                <Input
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder={t("companyPlaceholder")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t("jobDescription")}</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("jobDescriptionPlaceholder")}
                  rows={6}
                />
              </div>
              <Button type="submit" className="w-full">
                <Sparkles className="mr-2 h-4 w-4" />
                {t("createPosting")}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6 lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Briefcase className="h-5 w-5 text-violet-600" />
                {t("activePostings")}
              </CardTitle>
              <CardDescription>{t("activePostingsDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              {postings.length === 0 ? (
                <p className="rounded-lg border border-dashed border-zinc-200 px-4 py-10 text-center text-sm text-zinc-500 dark:border-zinc-800">
                  {t("noPostings")}
                </p>
              ) : (
                <ul className="space-y-4">
                  {postings.map((posting) => (
                    <li
                      key={posting.id}
                      className="rounded-xl border border-zinc-200/80 p-4 dark:border-zinc-800/80"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold">{posting.title}</h3>
                          <p className="text-sm text-zinc-500">{posting.company}</p>
                        </div>
                        <Badge variant="outline">{t("statusOpen")}</Badge>
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                        {posting.description}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileSearch className="h-5 w-5 text-violet-600" />
                {t("candidateMatch")}
              </CardTitle>
              <CardDescription>{t("candidateMatchDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{t("comingSoon")}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
