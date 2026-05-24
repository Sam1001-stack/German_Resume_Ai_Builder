import apiClient from "./api-client";
import type { ResumeDocument } from "@/types/resume-builder";

export interface SavedUserResume {
  _id: string;
  clientId: string;
  title: string;
  locale: "en" | "de";
  content: ResumeDocument;
  updatedAt: string;
  createdAt: string;
}

export interface SaveUserResumePayload {
  locale: "en" | "de";
  content: ResumeDocument;
}

export const userResumeService = {
  save: (payload: SaveUserResumePayload) =>
    apiClient.post<SavedUserResume>("/user-resumes", payload, { timeout: 120000 }),

  getAll: () => apiClient.get<SavedUserResume[]>("/user-resumes"),

  getById: (id: string) => apiClient.get<SavedUserResume>(`/user-resumes/${id}`),

  downloadPdf: async (id: string, filename: string) => {
    const response = await apiClient.get<Blob>(`/user-resumes/${id}/pdf`, {
      responseType: "blob",
      timeout: 120000,
    });
    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename.replace(/[^\w\-]+/g, "_") || "resume"}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  delete: (id: string) => apiClient.delete(`/user-resumes/${id}`),
};
