"use client";

import { useTranslations } from "next-intl";
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  FolderKanban,
  Award,
  Languages,
  Link2,
  Wrench,
  Trash2,
} from "lucide-react";
import { useResumeStore } from "@/store/resume-store";
import { SectionCard } from "./section-card";
import { FloatingInput } from "@/components/ui/floating-input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AiButton } from "./ai-button";
import { useAiGeneration } from "@/hooks/use-ai-generation";
import { SortableList } from "./sortable-list";
import { TECH_SUGGESTIONS, LANGUAGE_LEVELS, SOCIAL_PLATFORMS } from "@/features/resume-builder/constants";
import type {
  WorkExperience,
  Education,
  Project,
  Certification,
  Language,
  SocialLink,
} from "@/types/resume-builder";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useResumeHydrated } from "@/hooks/use-resume-hydrated";
import { Skeleton } from "@/components/ui/skeleton";
import { ResumeTypeSelector } from "./resume-type-selector";
import { WerkstudentFields } from "./werkstudent-fields";

export function ResumeFormSections() {
  const t = useTranslations("builder");
  const hydrated = useResumeHydrated();
  const resume = useResumeStore((s) => s.resume);
  const updateResume = useResumeStore((s) => s.updateResume);
  const expanded = useResumeStore((s) => s.expandedSections);
  const toggle = useResumeStore((s) => s.toggleSection);
  const { generate, isGenerating } = useAiGeneration();

  const updatePersonal = (field: keyof typeof resume.personal, value: string) =>
    updateResume({ personal: { ...resume.personal, [field]: value } });

  const addExperience = () => {
    const item: WorkExperience = {
      id: crypto.randomUUID(),
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      bullets: [""],
    };
    updateResume({ experience: [...resume.experience, item] });
  };

  const updateExperience = (id: string, patch: Partial<WorkExperience>) =>
    updateResume({
      experience: resume.experience.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    });

  const removeExperience = (id: string) =>
    updateResume({ experience: resume.experience.filter((e) => e.id !== id) });

  const removeEducation = (id: string) =>
    updateResume({ education: resume.education.filter((e) => e.id !== id) });

  const removeProject = (id: string) =>
    updateResume({ projects: resume.projects.filter((p) => p.id !== id) });

  const removeCertification = (id: string) =>
    updateResume({ certifications: resume.certifications.filter((c) => c.id !== id) });

  const removeLanguage = (id: string) =>
    updateResume({ languages: resume.languages.filter((l) => l.id !== id) });

  const removeSocialLink = (id: string) =>
    updateResume({ socialLinks: resume.socialLinks.filter((l) => l.id !== id) });

  const addSkill = (skill: string) => {
    if (!skill.trim() || resume.skills.includes(skill.trim())) return;
    updateResume({ skills: [...resume.skills, skill.trim()] });
  };

  const handleAiSummary = async () => {
    const text = await generate("summary");
    updateResume({ summary: text });
    toast.success(t("aiApplied"));
  };

  const handleAiSkills = async () => {
    const skills = await generate("skills");
    const newSkills = String(skills).split(",").map((s) => s.trim()).filter(Boolean);
    updateResume({ skills: [...new Set([...resume.skills, ...newSkills])] });
    toast.success(t("aiApplied"));
  };

  if (!hydrated) {
    return (
      <div className="space-y-4 pb-24">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-24">
      <ResumeTypeSelector instanceId="form" />
      <WerkstudentFields />
      <SectionCard
        title={t("sections.personal")}
        icon={<User className="h-4 w-4" />}
        open={expanded.personal}
        onToggle={() => toggle("personal")}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <FloatingInput
            label={t("fields.firstName")}
            value={resume.personal.firstName}
            onChange={(e) => updatePersonal("firstName", e.target.value)}
          />
          <FloatingInput
            label={t("fields.lastName")}
            value={resume.personal.lastName}
            onChange={(e) => updatePersonal("lastName", e.target.value)}
          />
          <FloatingInput
            label={t("fields.email")}
            type="email"
            value={resume.personal.email}
            onChange={(e) => updatePersonal("email", e.target.value)}
          />
          <FloatingInput
            label={t("fields.phone")}
            value={resume.personal.phone}
            onChange={(e) => updatePersonal("phone", e.target.value)}
          />
          <FloatingInput
            label={t("fields.headline")}
            value={resume.personal.headline}
            onChange={(e) => updatePersonal("headline", e.target.value)}
            className="sm:col-span-2"
          />
          <FloatingInput
            label={t("fields.address")}
            value={resume.personal.address}
            onChange={(e) => updatePersonal("address", e.target.value)}
            className="sm:col-span-2"
          />
          <FloatingInput
            label={t("fields.city")}
            value={resume.personal.city}
            onChange={(e) => updatePersonal("city", e.target.value)}
          />
          <FloatingInput
            label={t("fields.country")}
            value={resume.personal.country}
            onChange={(e) => updatePersonal("country", e.target.value)}
          />
        </div>
      </SectionCard>

      <SectionCard
        title={t("sections.summary")}
        icon={<FileText className="h-4 w-4" />}
        open={expanded.summary}
        onToggle={() => toggle("summary")}
      >
        <div className="flex flex-wrap gap-2">
          <AiButton label={t("ai.generateSummary")} loading={isGenerating} onClick={handleAiSummary} />
          <AiButton
            label={t("ai.improve")}
            loading={isGenerating}
            onClick={async () => {
              const text = await generate("improve");
              updateResume({ summary: text });
            }}
          />
        </div>
        <Textarea
          value={resume.summary}
          onChange={(e) => updateResume({ summary: e.target.value })}
          rows={4}
          className="mt-3 resize-none"
          placeholder={t("fields.summaryPlaceholder")}
        />
      </SectionCard>

      <SectionCard
        title={t("sections.skills")}
        icon={<Wrench className="h-4 w-4" />}
        open={expanded.skills}
        onToggle={() => toggle("skills")}
        badge={String(resume.skills.length)}
      >
        <AiButton label={t("ai.generateSkills")} loading={isGenerating} onClick={handleAiSkills} />
        <div className="mt-3 flex flex-wrap gap-2">
          {resume.skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-800 dark:bg-violet-950 dark:text-violet-300"
            >
              {skill}
              <button
                type="button"
                onClick={() => updateResume({ skills: resume.skills.filter((s) => s !== skill) })}
                className="hover:text-red-600"
                aria-label={`Remove ${skill}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
          {TECH_SUGGESTIONS.filter((s) => !resume.skills.includes(s)).slice(0, 8).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => addSkill(s)}
              className="rounded-lg border border-dashed border-zinc-300 px-2 py-1 text-xs text-zinc-600 hover:border-violet-400 hover:text-violet-600 dark:border-zinc-700"
            >
              + {s}
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title={t("sections.experience")}
        icon={<Briefcase className="h-4 w-4" />}
        open={expanded.experience}
        onToggle={() => toggle("experience")}
        onAdd={addExperience}
        addLabel={t("addExperience")}
        badge={String(resume.experience.length)}
      >
        <SortableList
          items={resume.experience}
          onReorder={(experience) => updateResume({ experience })}
          renderItem={(exp) => (
            <div className="space-y-3">
              <div className="flex justify-end">
                <Button type="button" variant="ghost" size="icon" onClick={() => removeExperience(exp.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <FloatingInput
                  label={t("fields.position")}
                  value={exp.position}
                  onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                />
                <FloatingInput
                  label={t("fields.company")}
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                />
                <FloatingInput
                  label={t("fields.startDate")}
                  type="month"
                  value={exp.startDate}
                  placeholder="YYYY-MM"
                  onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                />
                <FloatingInput
                  label={t("fields.endDate")}
                  type="month"
                  value={exp.endDate}
                  placeholder="YYYY-MM"
                  onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                  disabled={exp.current}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-zinc-200 px-3 py-2 dark:border-zinc-700">
                <span className="text-sm text-zinc-700 dark:text-zinc-300">{t("fields.currentlyWorking")}</span>
                <Switch
                  checked={exp.current}
                  onCheckedChange={(checked) =>
                    updateExperience(exp.id, { current: checked, endDate: checked ? "" : exp.endDate })
                  }
                />
              </div>
              <AiButton
                label={t("ai.enhanceBullets")}
                loading={isGenerating}
                onClick={async () => {
                  const text = await generate("bullets");
                  updateExperience(exp.id, { bullets: [text] });
                }}
              />
              <Textarea
                value={exp.bullets.join("\n")}
                onChange={(e) =>
                  updateExperience(exp.id, { bullets: e.target.value.split("\n").filter(Boolean) })
                }
                rows={3}
                placeholder={t("fields.bulletsPlaceholder")}
              />
            </div>
          )}
        />
      </SectionCard>

      <SectionCard
        title={t("sections.education")}
        icon={<GraduationCap className="h-4 w-4" />}
        open={expanded.education}
        onToggle={() => toggle("education")}
        onAdd={() =>
          updateResume({
            education: [
              ...resume.education,
              {
                id: crypto.randomUUID(),
                institution: "",
                degree: "",
                field: "",
                startDate: "",
                endDate: "",
                current: false,
                description: "",
              },
            ],
          })
        }
        addLabel={t("addEducation")}
      >
        {resume.education.map((edu) => (
          <div key={edu.id} className="grid gap-3 rounded-lg border border-zinc-100 p-3 dark:border-zinc-800 sm:grid-cols-2">
            <div className="flex justify-end sm:col-span-2">
              <Button type="button" variant="ghost" size="icon" onClick={() => removeEducation(edu.id)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
            <FloatingInput
              label={t("fields.institution")}
              value={edu.institution}
              onChange={(e) =>
                updateResume({
                  education: resume.education.map((x) =>
                    x.id === edu.id ? { ...x, institution: e.target.value } : x
                  ),
                })
              }
            />
            <FloatingInput
              label={t("fields.degree")}
              value={edu.degree}
              onChange={(e) =>
                updateResume({
                  education: resume.education.map((x) =>
                    x.id === edu.id ? { ...x, degree: e.target.value } : x
                  ),
                })
              }
            />
            <FloatingInput
              label={t("fields.startDate")}
              type="month"
              value={edu.startDate}
              placeholder="YYYY-MM"
              onChange={(e) =>
                updateResume({
                  education: resume.education.map((x) =>
                    x.id === edu.id ? { ...x, startDate: e.target.value } : x
                  ),
                })
              }
            />
            <FloatingInput
              label={t("fields.endDate")}
              type="month"
              value={edu.endDate}
              placeholder="YYYY-MM"
              onChange={(e) =>
                updateResume({
                  education: resume.education.map((x) =>
                    x.id === edu.id ? { ...x, endDate: e.target.value } : x
                  ),
                })
              }
              disabled={Boolean(edu.current)}
            />
            <div className="sm:col-span-2 flex items-center justify-between rounded-lg border border-zinc-200 px-3 py-2 dark:border-zinc-700">
              <span className="text-sm text-zinc-700 dark:text-zinc-300">{t("fields.currentlyStudying")}</span>
              <Switch
                checked={Boolean(edu.current)}
                onCheckedChange={(checked) =>
                  updateResume({
                    education: resume.education.map((x) =>
                      x.id === edu.id ? { ...x, current: checked, endDate: checked ? "" : x.endDate } : x
                    ),
                  })
                }
              />
            </div>
          </div>
        ))}
      </SectionCard>

      <SectionCard
        title={t("sections.projects")}
        icon={<FolderKanban className="h-4 w-4" />}
        open={expanded.projects}
        onToggle={() => toggle("projects")}
        onAdd={() =>
          updateResume({
            projects: [
              ...resume.projects,
              { id: crypto.randomUUID(), name: "", url: "", description: "", technologies: [] },
            ],
          })
        }
        addLabel={t("addProject")}
      >
        {resume.projects.map((p) => (
          <div key={p.id} className="space-y-2 rounded-lg border border-zinc-100 p-3 dark:border-zinc-800">
            <div className="flex justify-end">
              <Button type="button" variant="ghost" size="icon" onClick={() => removeProject(p.id)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
            <FloatingInput
              label={t("fields.projectName")}
              value={p.name}
              onChange={(e) =>
                updateResume({
                  projects: resume.projects.map((x) =>
                    x.id === p.id ? { ...x, name: e.target.value } : x
                  ),
                })
              }
            />
            <Textarea
              value={p.description}
              onChange={(e) =>
                updateResume({
                  projects: resume.projects.map((x) =>
                    x.id === p.id ? { ...x, description: e.target.value } : x
                  ),
                })
              }
              rows={2}
            />
          </div>
        ))}
      </SectionCard>

      <SectionCard
        title={t("sections.certifications")}
        icon={<Award className="h-4 w-4" />}
        open={expanded.certifications}
        onToggle={() => toggle("certifications")}
        onAdd={() =>
          updateResume({
            certifications: [
              ...resume.certifications,
              { id: crypto.randomUUID(), name: "", issuer: "", date: "" },
            ],
          })
        }
        addLabel={t("addCertification")}
      >
        {resume.certifications.map((c: Certification) => (
          <div key={c.id} className="grid gap-3 sm:grid-cols-2">
            <div className="flex justify-end sm:col-span-2">
              <Button type="button" variant="ghost" size="icon" onClick={() => removeCertification(c.id)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
            <FloatingInput
              label={t("fields.certName")}
              value={c.name}
              onChange={(e) =>
                updateResume({
                  certifications: resume.certifications.map((x) =>
                    x.id === c.id ? { ...x, name: e.target.value } : x
                  ),
                })
              }
            />
            <FloatingInput
              label={t("fields.issuer")}
              value={c.issuer}
              onChange={(e) =>
                updateResume({
                  certifications: resume.certifications.map((x) =>
                    x.id === c.id ? { ...x, issuer: e.target.value } : x
                  ),
                })
              }
            />
          </div>
        ))}
      </SectionCard>

      <SectionCard
        title={t("sections.languages")}
        icon={<Languages className="h-4 w-4" />}
        open={expanded.languages}
        onToggle={() => toggle("languages")}
        onAdd={() =>
          updateResume({
            languages: [
              ...resume.languages,
              { id: crypto.randomUUID(), name: "", level: "B2" },
            ],
          })
        }
        addLabel={t("addLanguage")}
      >
        {resume.languages.map((lang: Language) => (
          <div key={lang.id} className="flex gap-2">
            <FloatingInput
              label={t("fields.language")}
              value={lang.name}
              onChange={(e) =>
                updateResume({
                  languages: resume.languages.map((x) =>
                    x.id === lang.id ? { ...x, name: e.target.value } : x
                  ),
                })
              }
              className="flex-1"
            />
            <Select
              value={lang.level}
              onValueChange={(level) =>
                updateResume({
                  languages: resume.languages.map((x) =>
                    x.id === lang.id ? { ...x, level } : x
                  ),
                })
              }
            >
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGE_LEVELS.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="button" variant="ghost" size="icon" onClick={() => removeLanguage(lang.id)}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ))}
      </SectionCard>

      <SectionCard
        title={t("sections.social")}
        icon={<Link2 className="h-4 w-4" />}
        open={expanded.social}
        onToggle={() => toggle("social")}
        onAdd={() =>
          updateResume({
            socialLinks: [
              ...resume.socialLinks,
              { id: crypto.randomUUID(), platform: "LinkedIn", url: "" },
            ],
          })
        }
        addLabel={t("addLink")}
      >
        {resume.socialLinks.map((link: SocialLink) => (
          <div key={link.id} className="flex gap-2">
            <Select
              value={link.platform}
              onValueChange={(platform) =>
                updateResume({
                  socialLinks: resume.socialLinks.map((x) =>
                    x.id === link.id ? { ...x, platform } : x
                  ),
                })
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SOCIAL_PLATFORMS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FloatingInput
              label="URL"
              value={link.url}
              onChange={(e) =>
                updateResume({
                  socialLinks: resume.socialLinks.map((x) =>
                    x.id === link.id ? { ...x, url: e.target.value } : x
                  ),
                })
              }
              className="flex-1"
            />
            <Button type="button" variant="ghost" size="icon" onClick={() => removeSocialLink(link.id)}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ))}
      </SectionCard>
    </div>
  );
}