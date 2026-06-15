import type { ResumeDocument } from "@/types/resume-builder";
import {
  EMPTY_DEVELOPER_SKILLS,
  flattenDeveloperSkills,
} from "@/features/resume-builder/constants/developer-skills";

export function isDeveloperSkillsMode(resume: ResumeDocument): boolean {
  return resume.fieldCategory === "it" && resume.itFieldType === "developer";
}

export function getDeveloperSkillGroups(resume: ResumeDocument) {
  return resume.developerSkills ?? EMPTY_DEVELOPER_SKILLS;
}

export function withSyncedDeveloperSkills(
  groups: ResumeDocument["developerSkills"]
): Pick<ResumeDocument, "developerSkills" | "skills"> {
  const developerSkills = groups ?? EMPTY_DEVELOPER_SKILLS;
  return {
    developerSkills,
    skills: flattenDeveloperSkills(developerSkills),
  };
}
