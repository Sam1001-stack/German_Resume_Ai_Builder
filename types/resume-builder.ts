export type ResumeType = "professional" | "werkstudent";

export type FieldCategory = "it" | "other";

export type ItFieldType = "developer" | "general";

export type TemplateId =
  | "german-ats"
  | "minimal"
  | "corporate"
  | "creative"
  | "startup";

export interface WerkstudentInfo {
  visaStatus: string;
  taxId: string;
  socialSecurityNo: string;
  availability: string;
  universityEnrollment: string;
}

export interface ResumeTheme {
  primary: string;
  accent: string;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  headline: string;
  photoUrl?: string;
  willingToRelocate?: boolean | null;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  bullets: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current?: boolean;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  url: string;
  description: string;
  technologies: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface Language {
  id: string;
  name: string;
  level: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface ResumeDocument {
  id: string;
  title: string;
  resumeType: ResumeType;
  fieldCategory: FieldCategory;
  itFieldType?: ItFieldType | null;
  templateId: TemplateId;
  theme: ResumeTheme;
  updatedAt: string;
  werkstudent: WerkstudentInfo;
  personal: PersonalInfo;
  summary: string;
  skills: string[];
  experience: WorkExperience[];
  education: Education[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  socialLinks: SocialLink[];
  serverId?: string;
}

export type ResumeSectionKey =
  | "personal"
  | "summary"
  | "skills"
  | "experience"
  | "education"
  | "projects"
  | "certifications"
  | "languages"
  | "social";
