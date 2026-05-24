import type { ResumeDocument } from "@/types/resume-builder";
import { DEMO_RESUME } from "@/features/resume-builder/default-resume";
import type { SavedUserResume } from "@/services/user-resume-service";

export function normalizeResumeDocument(
  content: Partial<ResumeDocument>,
  overrides?: Partial<ResumeDocument>
): ResumeDocument {
  return {
    ...DEMO_RESUME,
    ...content,
    ...overrides,
    personal: { ...DEMO_RESUME.personal, ...(content.personal ?? {}) },
    werkstudent: { ...DEMO_RESUME.werkstudent, ...(content.werkstudent ?? {}) },
    skills: content.skills ?? [],
    experience: content.experience ?? [],
    education: content.education ?? [],
    projects: content.projects ?? [],
    certifications: content.certifications ?? [],
    languages: content.languages ?? [],
    socialLinks: content.socialLinks ?? [],
    resumeType: content.resumeType ?? DEMO_RESUME.resumeType,
    templateId: content.templateId ?? DEMO_RESUME.templateId,
    theme: { ...DEMO_RESUME.theme, ...(content.theme ?? {}) },
  };
}

export function mapSavedUserResume(item: SavedUserResume): ResumeDocument {
  return normalizeResumeDocument(item.content, {
    serverId: item._id,
    title: item.title,
    updatedAt: item.updatedAt,
  });
}
