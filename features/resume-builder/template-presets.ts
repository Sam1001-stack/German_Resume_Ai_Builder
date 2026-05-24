import type { ResumeDocument, ResumeTheme, TemplateId } from "@/types/resume-builder";
import { DEMO_RESUME } from "./default-resume";

export interface TemplatePreset {
  id: TemplateId;
  labelKey: string;
  descriptionKey: string;
  theme: ResumeTheme;
  atsFriendly?: boolean;
}

export const TEMPLATE_PRESETS: TemplatePreset[] = [
  {
    id: "german-ats",
    labelKey: "germanAts",
    descriptionKey: "germanAtsDesc",
    theme: { primary: "#312e81", accent: "#4f46e5" },
    atsFriendly: true,
  },
  {
    id: "minimal",
    labelKey: "minimal",
    descriptionKey: "minimalDesc",
    theme: { primary: "#18181b", accent: "#52525b" },
    atsFriendly: true,
  },
  {
    id: "corporate",
    labelKey: "corporate",
    descriptionKey: "corporateDesc",
    theme: { primary: "#0f766e", accent: "#14b8a6" },
    atsFriendly: true,
  },
  {
    id: "creative",
    labelKey: "creative",
    descriptionKey: "creativeDesc",
    theme: { primary: "#7c3aed", accent: "#a78bfa" },
  },
  {
    id: "startup",
    labelKey: "startup",
    descriptionKey: "startupDesc",
    theme: { primary: "#ea580c", accent: "#fb923c" },
  },
];

export function isTemplateId(value: string): value is TemplateId {
  return TEMPLATE_PRESETS.some((preset) => preset.id === value);
}

export function getTemplatePreset(id: TemplateId): TemplatePreset {
  return TEMPLATE_PRESETS.find((preset) => preset.id === id) ?? TEMPLATE_PRESETS[0];
}

export function buildPreviewResume(templateId: TemplateId): ResumeDocument {
  const preset = getTemplatePreset(templateId);
  return {
    ...DEMO_RESUME,
    id: `preview-${templateId}`,
    templateId: preset.id,
    theme: preset.theme,
  };
}
