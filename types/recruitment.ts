export type ExperienceLevel =
  | "intern"
  | "junior"
  | "mid"
  | "senior"
  | "lead"
  | "executive";

export interface RecruiterJob {
  _id: string;
  title: string;
  company: string;
  description: string;
  requiredSkills: string[];
  experienceLevel: ExperienceLevel;
  certifications: string[];
  languages: string[];
  status: "draft" | "open" | "closed";
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobPayload {
  title: string;
  company: string;
  description: string;
  requiredSkills?: string[];
  experienceLevel?: ExperienceLevel;
  certifications?: string[];
  languages?: string[];
}

export interface RecruiterResume {
  _id: string;
  fileName: string;
  fileSize: number;
  status: "uploaded" | "processing" | "analyzed" | "failed";
  errorMessage?: string;
  createdAt: string;
}

export interface ScoreBreakdown {
  skills: number;
  experience: number;
  summary: number;
  education: number;
  certifications: number;
  languages: number;
}

export interface TopCandidate {
  rank: number;
  candidateName: string;
  email: string;
  phone: string;
  location: string;
  matchScore: number;
  vectorSimilarity: number;
  experienceYears: number;
  currentRole: string;
  skillsMatched: string[];
  missingSkills: string[];
  education: string;
  languages: string[];
  certifications: string[];
  summary: string;
  strengths: string[];
  weaknesses: string[];
  rejectionReasons: string[];
  loopholes: string[];
  recommendation: string;
  resumeFile: string;
  resumeId: string;
  interviewQuestions: string[];
  scoreBreakdown: ScoreBreakdown;
}

export interface RejectedCandidate extends TopCandidate {
  scanFailed?: boolean;
}

export interface DashboardAnalytics {
  totalResumes: number;
  analyzedResumes: number;
  averageScore: number;
  skillDistribution: Record<string, number>;
  experienceDistribution: Record<string, number>;
  recommendationBreakdown: Record<string, number>;
}

export interface ScanSession {
  status: "idle" | "running" | "completed" | "failed";
  total: number;
  processed: number;
  failed: number;
  message?: string;
}

export interface RecruiterDashboard {
  job: RecruiterJob;
  topCandidates: TopCandidate[];
  rejectedCandidates: RejectedCandidate[];
  analytics: DashboardAnalytics;
  resumes: RecruiterResume[];
  scanSession: ScanSession | null;
}
