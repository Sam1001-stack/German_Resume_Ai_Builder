export type ResumeType = "professional" | "werkstudent";

export type ValidationStatus = "pass" | "warning" | "fail";

export type ValidationSectionId =
  | "header"
  | "summary"
  | "skills"
  | "experience"
  | "projects"
  | "education"
  | "languages"
  | "werkstudent"
  | "format";

export interface ValidationCheck {
  id: string;
  status: ValidationStatus;
  messageKey: string;
  suggestionKey?: string;
}

export interface SectionAnalysis {
  id: ValidationSectionId;
  titleKey: string;
  score: number;
  checks: ValidationCheck[];
}

export interface ResumeAnalysisReport {
  resumeType: ResumeType;
  verdictKey: string;
  scores: {
    ats: number;
    germanHr: number;
    technical: number;
    hiringReadiness: number;
  };
  sections: SectionAnalysis[];
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  missingSections: string[];
  suggestions: string[];
  atsTips: string[];
}
