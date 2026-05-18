import type { ResumeDocument } from "@/types/resume-builder";

export function calculateCompletion(resume: ResumeDocument): number {
  let score = 0;
  const weights = {
    personal: 20,
    summary: 15,
    skills: 15,
    experience: 25,
    education: 10,
    projects: 5,
    certifications: 5,
    languages: 5,
  };

  const { personal } = resume;
  if (personal.firstName && personal.lastName && personal.email) score += weights.personal * 0.6;
  if (personal.phone && personal.city) score += weights.personal * 0.4;

  if (resume.summary.length > 50) score += weights.summary;
  if (resume.skills.length >= 3) score += weights.skills;
  if (resume.experience.length >= 1) score += weights.experience;
  if (resume.education.length >= 1) score += weights.education;
  if (resume.projects.length >= 1) score += weights.projects;
  if (resume.certifications.length >= 1) score += weights.certifications;
  if (resume.languages.length >= 1) score += weights.languages;

  return Math.min(100, Math.round(score));
}

export function calculateAtsScore(resume: ResumeDocument): number {
  let score = 50;
  if (resume.summary.length > 80) score += 10;
  if (resume.skills.length >= 5) score += 15;
  if (resume.experience.some((e) => e.bullets.length >= 2)) score += 15;
  if (resume.personal.email && resume.personal.phone) score += 10;
  return Math.min(98, score);
}
