import type { TemplateId } from "@/types/resume-builder";

export const TEMPLATE_OPTIONS: {
  id: TemplateId;
  labelKey: string;
  descriptionKey: string;
}[] = [
  { id: "german-ats", labelKey: "germanAts", descriptionKey: "germanAtsDesc" },
  { id: "minimal", labelKey: "minimal", descriptionKey: "minimalDesc" },
  { id: "corporate", labelKey: "corporate", descriptionKey: "corporateDesc" },
  { id: "creative", labelKey: "creative", descriptionKey: "creativeDesc" },
  { id: "startup", labelKey: "startup", descriptionKey: "startupDesc" },
];

export const TECH_SUGGESTIONS = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "AWS",
  "Docker",
  "PostgreSQL",
  "MongoDB",
  "Figma",
  "Agile",
  "German",
  "English",
];

export const LANGUAGE_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2", "Native"];

export const SOCIAL_PLATFORMS = ["LinkedIn", "GitHub", "Portfolio", "X", "Xing"];
