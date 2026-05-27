import apiClient from "./api-client";
import type {
  CreateJobPayload,
  RecruiterDashboard,
  RecruiterJob,
} from "@/types/recruitment";

export const recruiterService = {
  createJob: (payload: CreateJobPayload) =>
    apiClient.post<{ job: RecruiterJob }>("/recruiter/jobs", payload),

  listJobs: () => apiClient.get<{ jobs: RecruiterJob[] }>("/recruiter/jobs"),

  getDashboard: (jobId: string) =>
    apiClient.get<RecruiterDashboard>(`/recruiter/jobs/${jobId}/dashboard`),

  uploadResumes: (jobId: string, files: File[]) => {
    const form = new FormData();
    for (const file of files) {
      form.append("resumes", file);
    }
    return apiClient.post<{
      uploaded: Array<{ id: string; fileName: string; duplicate: boolean }>;
      duplicates: string[];
    }>(`/recruiter/jobs/${jobId}/resumes`, form, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 120000,
    });
  },

  startScan: (jobId: string) =>
    apiClient.post<{ message: string; jobId: string }>(
      `/recruiter/jobs/${jobId}/scan`,
      {},
      { timeout: 30000 }
    ),

  downloadResume: async (jobId: string, resumeId: string, fileName: string) => {
    const response = await apiClient.get<Blob>(
      `/recruiter/jobs/${jobId}/resumes/${resumeId}/download`,
      { responseType: "blob" }
    );
    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName || "resume.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
