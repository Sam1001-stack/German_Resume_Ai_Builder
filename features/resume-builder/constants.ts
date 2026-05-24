import type { TemplateId } from "@/types/resume-builder";

import { TEMPLATE_PRESETS } from "./template-presets";

export { TEMPLATE_PRESETS, getTemplatePreset, isTemplateId } from "./template-presets";

export const TEMPLATE_OPTIONS = TEMPLATE_PRESETS.map(({ id, labelKey, descriptionKey }) => ({
  id,
  labelKey,
  descriptionKey,
}));

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
