import apiClient from "./api-client";

import type { DeveloperSkillGroups } from "@/types/resume-builder";

export interface TailorFromJobPayload {
  jobDescription: string;
  locale: "en" | "de";
  resumeType: "professional" | "werkstudent";
  headline?: string;
  currentSummary?: string;
  currentSkills?: string[];
  fieldCategory?: "it" | "other";
  itFieldType?: "developer" | "general";
}

export interface TailorFromJobResponse {
  summary: string;
  skills: string[];
  developerSkills?: DeveloperSkillGroups;
}

export interface TailorSectionFromJobPayload {
  jobDescription: string;
  locale: "en" | "de";
  resumeType: "professional" | "werkstudent";
  sectionType: "experience" | "project";
  rawDescription: string;
  title?: string;
  company?: string;
}

export interface TailorSectionFromJobResponse {
  lines: [string, string];
}

export const aiService = {
  tailorFromJobDescription(payload: TailorFromJobPayload) {
    return apiClient.post<TailorFromJobResponse>("/ai/tailor-from-job", payload, {
      timeout: 90000,
    });
  },

  tailorSectionFromJob(payload: TailorSectionFromJobPayload) {
    return apiClient.post<TailorSectionFromJobResponse>(
      "/ai/tailor-section-from-job",
      payload,
      { timeout: 90000 }
    );
  },
};
