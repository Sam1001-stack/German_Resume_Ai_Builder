"use client";

import { useTranslations } from "next-intl";
import { GraduationCap } from "lucide-react";
import { useResumeStore } from "@/store/resume-store";
import { SectionCard } from "./section-card";
import { FloatingInput } from "@/components/ui/floating-input";

export function WerkstudentFields() {
  const t = useTranslations("builder");
  const resume = useResumeStore((s) => s.resume);
  const updateResume = useResumeStore((s) => s.updateResume);
  const expanded = useResumeStore((s) => s.expandedSections);
  const toggle = useResumeStore((s) => s.toggleSection);

  if (resume.resumeType !== "werkstudent") return null;

  const update = (field: keyof typeof resume.werkstudent, value: string) =>
    updateResume({ werkstudent: { ...resume.werkstudent, [field]: value } });

  return (
    <SectionCard
      title={t("sections.werkstudent")}
      icon={<GraduationCap className="h-4 w-4" />}
      open={expanded.werkstudent ?? true}
      onToggle={() => toggle("werkstudent")}
    >
      <div className="grid gap-3">
        <FloatingInput
          label={t("fields.visaStatus")}
          value={resume.werkstudent.visaStatus}
          onChange={(e) => update("visaStatus", e.target.value)}
          placeholder={t("fields.visaPlaceholder")}
        />
        <FloatingInput
          label={t("fields.taxId")}
          value={resume.werkstudent.taxId}
          onChange={(e) => update("taxId", e.target.value)}
          placeholder={t("fields.taxPlaceholder")}
        />
        <FloatingInput
          label={t("fields.availability")}
          value={resume.werkstudent.availability}
          onChange={(e) => update("availability", e.target.value)}
          placeholder={t("fields.availabilityPlaceholder")}
        />
        <FloatingInput
          label={t("fields.universityEnrollment")}
          value={resume.werkstudent.universityEnrollment}
          onChange={(e) => update("universityEnrollment", e.target.value)}
          placeholder={t("fields.enrollmentPlaceholder")}
        />
      </div>
    </SectionCard>
  );
}
