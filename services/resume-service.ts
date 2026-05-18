import apiClient from "./api-client";

export interface Resume {
  _id: string;
  title: string;
  personalInfo?: Record<string, string>;
  summary?: string;
  updatedAt: string;
  createdAt: string;
}

export const resumeService = {
  getAll: () => apiClient.get<Resume[]>("/resumes"),
  getById: (id: string) => apiClient.get<Resume>(`/resumes/${id}`),
  create: (data: Partial<Resume>) => apiClient.post<Resume>("/resumes", data),
  update: (id: string, data: Partial<Resume>) =>
    apiClient.put<Resume>(`/resumes/${id}`, data),
  delete: (id: string) => apiClient.delete(`/resumes/${id}`),
};
