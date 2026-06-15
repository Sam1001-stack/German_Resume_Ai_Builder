"use client";

import { useLocale } from "next-intl";
import { isStackHighlight } from "@/features/resume-builder/constants/developer-skills";
import { isDeveloperSkillsMode } from "@/features/resume-builder/utils/developer-skills-mode";
import { resumePreviewLabel } from "@/lib/locale-utils";
import type { DeveloperSkillCategoryId, ResumeDocument } from "@/types/resume-builder";

const categories: {
  id: DeveloperSkillCategoryId;
  labelKey: "skillBackend" | "skillFrontend" | "skillDevops";
  color: string;
}[] = [
  { id: "backend", labelKey: "skillBackend", color: "#0284c7" },
  { id: "frontend", labelKey: "skillFrontend", color: "#7c3aed" },
  { id: "devops", labelKey: "skillDevops", color: "#d97706" },
];

interface Props {
  resume: ResumeDocument;
}

function renderSkillLine(skills: string[], categoryId: DeveloperSkillCategoryId) {
  return skills.map((skill, index) => {
    const highlighted = isStackHighlight(categoryId, skill);
    return (
      <span key={skill}>
        {index > 0 ? " · " : null}
        <span className={highlighted ? "font-semibold text-zinc-900" : undefined}>{skill}</span>
      </span>
    );
  });
}

export function DeveloperSkillsPreview({ resume }: Props) {
  const locale = useLocale();
  if (!isDeveloperSkillsMode(resume) || !resume.developerSkills) return null;

  const groups = resume.developerSkills;
  const hasSkills = categories.some((category) => groups[category.id].length > 0);
  if (!hasSkills) return null;

  return (
    <div className="space-y-2.5">
      {categories.map((category) => {
        const skills = groups[category.id];
        if (!skills.length) return null;

        return (
          <div key={category.id}>
            <p
              className="mb-0.5 text-[10px] font-bold uppercase tracking-wide"
              style={{ color: category.color }}
            >
              {resumePreviewLabel(locale, category.labelKey)}
            </p>
            <p className="text-[11px] text-zinc-700">{renderSkillLine(skills, category.id)}</p>
          </div>
        );
      })}
    </div>
  );
}
