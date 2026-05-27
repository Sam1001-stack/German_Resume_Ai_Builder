"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Brain, Loader2, Play, Plus } from "lucide-react";
import { toast } from "sonner";
import { recruiterService } from "@/services/recruiter-service";
import { useRecruiterScan } from "@/hooks/use-recruiter-scan";
import type { CreateJobPayload, RecruiterDashboard, RecruiterJob } from "@/types/recruitment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ResumeUploader } from "./components/resume-uploader";
import { TopCandidatesPanel } from "./components/top-candidates-panel";
import { RejectedCandidatesModal } from "./components/rejected-candidates-modal";
import { AnalyticsPanel } from "./components/analytics-panel";

const EXPERIENCE_LEVELS = [
  "intern",
  "junior",
  "mid",
  "senior",
  "lead",
  "executive",
] as const;

export function RecruiterDashboard() {
  const t = useTranslations("recruiterBuilder");

  const [jobs, setJobs] = useState<RecruiterJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<RecruiterDashboard | null>(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [rejectedModalOpen, setRejectedModalOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [experienceLevel, setExperienceLevel] =
    useState<(typeof EXPERIENCE_LEVELS)[number]>("mid");
  const [certifications, setCertifications] = useState("");
  const [languages, setLanguages] = useState("English, German");

  const { progress, isComplete, error: scanError, reset: resetScan } = useRecruiterScan(
    scanning ? selectedJobId : null
  );

  const loadJobs = useCallback(async () => {
    try {
      const { data } = await recruiterService.listJobs();
      setJobs(data.jobs);
      setSelectedJobId((current) => current ?? data.jobs[0]?._id ?? null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("loadFailed"));
    }
  }, [t]);

  const loadDashboard = useCallback(
    async (jobId: string) => {
      setLoading(true);
      try {
        const { data } = await recruiterService.getDashboard(jobId);
        setDashboard(data);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : t("loadFailed"));
      } finally {
        setLoading(false);
      }
    },
    [t]
  );

  useEffect(() => {
    void loadJobs();
  }, [loadJobs]);

  useEffect(() => {
    if (selectedJobId) void loadDashboard(selectedJobId);
  }, [selectedJobId, loadDashboard]);

  useEffect(() => {
    if (isComplete && selectedJobId) {
      setScanning(false);
      void loadDashboard(selectedJobId);
      toast.success(t("scanComplete"));
      resetScan();
    }
  }, [isComplete, selectedJobId, loadDashboard, resetScan, t]);

  useEffect(() => {
    if (scanError) {
      setScanning(false);
      toast.error(scanError);
    }
  }, [scanError]);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !company.trim() || description.trim().length < 20) {
      toast.error(t("formValidation"));
      return;
    }

    const payload: CreateJobPayload = {
      title: title.trim(),
      company: company.trim(),
      description: description.trim(),
      requiredSkills: requiredSkills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      experienceLevel,
      certifications: certifications
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      languages: languages
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    setCreating(true);
    try {
      const { data } = await recruiterService.createJob(payload);
      toast.success(t("postingCreated"));
      setTitle("");
      setCompany("");
      setDescription("");
      setRequiredSkills("");
      await loadJobs();
      setSelectedJobId(data.job._id);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("createFailed"));
    } finally {
      setCreating(false);
    }
  };

  const handleUpload = async (files: File[]) => {
    if (!selectedJobId) {
      toast.error(t("selectJobFirst"));
      return;
    }
    try {
      const { data } = await recruiterService.uploadResumes(selectedJobId, files);
      if (data.duplicates.length) {
        toast.warning(t("duplicatesSkipped", { count: data.duplicates.length }));
      }
      toast.success(t("uploadedCount", { count: data.uploaded.filter((u) => !u.duplicate).length }));
      await loadDashboard(selectedJobId);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("uploadFailed"));
    }
  };

  const handleStartScan = async () => {
    if (!selectedJobId) return;
    setScanning(true);
    resetScan();
    try {
      await recruiterService.startScan(selectedJobId);
      toast.info(t("scanStarted"));
    } catch (e) {
      setScanning(false);
      toast.error(e instanceof Error ? e.message : t("scanFailed"));
    }
  };

  const scanPercent =
    progress && progress.total > 0
      ? Math.round((progress.processed / progress.total) * 100)
      : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Badge variant="secondary" className="mb-2">
            {t("aiAtsBadge")}
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">{t("pageTitle")}</h1>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">{t("pageSubtitle")}</p>
        </div>
        {jobs.length > 0 && (
          <Select value={selectedJobId ?? undefined} onValueChange={setSelectedJobId}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder={t("selectJob")} />
            </SelectTrigger>
            <SelectContent>
              {jobs.map((j) => (
                <SelectItem key={j._id} value={j._id}>
                  {j.title} — {j.company}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="grid gap-8 xl:grid-cols-5">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-violet-600" />
              {t("newPosting")}
            </CardTitle>
            <CardDescription>{t("newPostingDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateJob} className="space-y-4">
              <div className="space-y-2">
                <Label>{t("jobTitle")}</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>{t("company")}</Label>
                <Input value={company} onChange={(e) => setCompany(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>{t("requiredSkills")}</Label>
                <Input
                  value={requiredSkills}
                  onChange={(e) => setRequiredSkills(e.target.value)}
                  placeholder="React, Node.js, MongoDB, TypeScript"
                />
              </div>
              <div className="space-y-2">
                <Label>{t("experienceLevel")}</Label>
                <Select
                  value={experienceLevel}
                  onValueChange={(v) =>
                    setExperienceLevel(v as (typeof EXPERIENCE_LEVELS)[number])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPERIENCE_LEVELS.map((lvl) => (
                      <SelectItem key={lvl} value={lvl}>
                        {t(`levels.${lvl}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t("certificationsOptional")}</Label>
                <Input
                  value={certifications}
                  onChange={(e) => setCertifications(e.target.value)}
                  placeholder="AWS, Azure"
                />
              </div>
              <div className="space-y-2">
                <Label>{t("languagesOptional")}</Label>
                <Input value={languages} onChange={(e) => setLanguages(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>{t("jobDescription")}</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                />
              </div>
              <Button type="submit" className="w-full" loading={creating}>
                {t("createPosting")}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6 xl:col-span-3">
          {selectedJobId ? (
            <>
              <ResumeUploader onUpload={handleUpload} disabled={scanning} />

              <div className="flex flex-wrap gap-3">
                <Button onClick={handleStartScan} disabled={scanning || loading} loading={scanning}>
                  {scanning ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="mr-2 h-4 w-4" />
                  )}
                  {t("runAiScan")}
                </Button>
                <Button variant="outline" onClick={() => loadDashboard(selectedJobId)} disabled={loading}>
                  <Brain className="mr-2 h-4 w-4" />
                  {t("refresh")}
                </Button>
              </div>

              {scanning && progress && (
                <Card>
                  <CardContent className="pt-6">
                    <p className="mb-2 text-sm font-medium">{progress.message ?? t("scanning")}</p>
                    {progress.currentFile && (
                      <p className="mb-2 text-xs text-zinc-500">{progress.currentFile}</p>
                    )}
                    <Progress value={scanPercent} className="h-2" />
                    <p className="mt-2 text-xs text-zinc-500">
                      {progress.processed}/{progress.total} · {progress.failed} {t("failed")}
                    </p>
                  </CardContent>
                </Card>
              )}

              {loading && !dashboard ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
                </div>
              ) : dashboard ? (
                <>
                  <AnalyticsPanel
                    analytics={dashboard.analytics}
                    rejectedCount={dashboard.rejectedCandidates?.length ?? 0}
                    onRejectedClick={() => setRejectedModalOpen(true)}
                  />
                  <TopCandidatesPanel
                    candidates={dashboard.topCandidates}
                    onDownload={(resumeId, fileName) =>
                      void recruiterService.downloadResume(selectedJobId, resumeId, fileName)
                    }
                  />
                  <RejectedCandidatesModal
                    open={rejectedModalOpen}
                    onOpenChange={setRejectedModalOpen}
                    candidates={dashboard.rejectedCandidates ?? []}
                    onDownload={(resumeId, fileName) =>
                      void recruiterService.downloadResume(selectedJobId, resumeId, fileName)
                    }
                  />
                </>
              ) : null}
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-sm text-zinc-500">
                {t("createJobToStart")}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
