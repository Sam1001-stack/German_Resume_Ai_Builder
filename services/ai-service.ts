import apiClient from "./api-client";

export interface TailorFromJobPayload {
  jobDescription: string;
  locale: "en" | "de";
  resumeType: "professional" | "werkstudent";
  headline?: string;
  currentSummary?: string;
  currentSkills?: string[];
}

export interface TailorFromJobResponse {
  summary: string;
  skills: string[];
}

export const aiService = {
  tailorFromJobDescription(payload: TailorFromJobPayload) {
    return apiClient.post<TailorFromJobResponse>("/ai/tailor-from-job", payload, {
      timeout: 90000,
    });
  },
};
