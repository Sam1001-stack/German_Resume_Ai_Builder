import type { ResumeDocument } from "@/types/resume-builder";

export function createEmptyResume(id?: string): ResumeDocument {
  const resumeId = id ?? crypto.randomUUID();
  return {
    id: resumeId,
    title: "Untitled Resume",
    resumeType: "professional",
    fieldCategory: "it",
    itFieldType: "developer",
    templateId: "german-ats",
    theme: { primary: "#4f46e5", accent: "#6366f1" },
    updatedAt: new Date().toISOString(),
    werkstudent: {
      visaStatus: "",
      taxId: "",
      socialSecurityNo: "",
      availability: "",
      universityEnrollment: "",
    },
    personal: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "Germany",
      headline: "",
      willingToRelocate: null,
    },
    summary: "",
    skills: [],
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    languages: [],
    socialLinks: [],
  };
}

export const DEMO_RESUME: ResumeDocument = {
  id: "demo-resume",
  title: "Software Engineer — Lebenslauf",
  resumeType: "professional",
  fieldCategory: "it",
  itFieldType: "developer",
  templateId: "german-ats",
  theme: { primary: "#312e81", accent: "#4f46e5" },
  updatedAt: new Date().toISOString(),
  werkstudent: {
    visaStatus: "",
    taxId: "",
    socialSecurityNo: "",
    availability: "20 hours/week",
    universityEnrollment: "",
  },
  personal: {
    firstName: "Max",
    lastName: "Müller",
    email: "max.mueller@email.de",
    phone: "+49 170 1234567",
    address: "Musterstraße 12",
    city: "Berlin",
    country: "Germany",
    headline: "Senior Software Engineer",
  },
  summary:
    "Erfahrener Software Engineer mit 6+ Jahren Erfahrung in skalierbaren Webanwendungen, Cloud-Architektur und agilem Projektmanagement. Fokus auf TypeScript, React und Node.js.",
  skills: [
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "AWS",
    "Docker",
    "PostgreSQL",
    "Agile",
  ],
  experience: [
    {
      id: "exp-1",
      company: "TechVision GmbH",
      position: "Senior Software Engineer",
      location: "Berlin",
      startDate: "2022-03",
      endDate: "",
      current: true,
      description: "Lead development of customer-facing SaaS platform.",
      bullets: [
        "Architektur und Implementierung von Microservices mit Node.js und TypeScript",
        "Reduzierung der API-Latenz um 40% durch Caching und Query-Optimierung",
        "Mentoring eines Teams von 4 Entwicklern",
      ],
    },
    {
      id: "exp-2",
      company: "Digital Solutions AG",
      position: "Full Stack Developer",
      location: "München",
      startDate: "2019-01",
      endDate: "2022-02",
      current: false,
      description: "Entwicklung von E-Commerce und internen Tools.",
      bullets: [
        "Aufbau einer React/Next.js Frontend-Plattform mit 50k+ monatlichen Nutzern",
        "Integration von Zahlungsanbietern und ERP-Systemen",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "Technische Universität Berlin",
      degree: "M.Sc.",
      field: "Informatik",
      startDate: "2016-10",
      endDate: "2018-09",
      current: false,
      description: "Schwerpunkt: Software Engineering & Distributed Systems",
    },
  ],
  projects: [
    {
      id: "proj-1",
      name: "ResumeAI Builder",
      url: "https://github.com/example/resumeai",
      description: "Open-source AI resume builder with live preview.",
      technologies: ["Next.js", "TypeScript", "Tailwind"],
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Solutions Architect Associate",
      issuer: "Amazon Web Services",
      date: "2023-06",
    },
  ],
  languages: [
    { id: "lang-1", name: "German", level: "Native" },
    { id: "lang-2", name: "English", level: "C1" },
  ],
  socialLinks: [
    { id: "soc-1", platform: "LinkedIn", url: "https://linkedin.com/in/maxmueller" },
    { id: "soc-2", platform: "GitHub", url: "https://github.com/maxmueller" },
  ],
};
