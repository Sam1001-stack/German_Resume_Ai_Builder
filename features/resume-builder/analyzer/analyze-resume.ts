import type { ResumeDocument } from "@/types/resume-builder";
import type {
  ResumeAnalysisReport,
  ResumeType,
  SectionAnalysis,
  ValidationCheck,
  ValidationStatus,
} from "@/types/resume-analyzer";
import { ATS_KEYWORDS, ACTION_VERBS, METRIC_PATTERN } from "./constants";

function check(
  id: string,
  status: ValidationStatus,
  messageKey: string,
  suggestionKey?: string
): ValidationCheck {
  return { id, status, messageKey, suggestionKey };
}

function sectionScore(checks: ValidationCheck[]): number {
  if (!checks.length) return 0;
  const weights = { pass: 1, warning: 0.5, fail: 0 };
  const total = checks.reduce((s, c) => s + weights[c.status], 0);
  return Math.round((total / checks.length) * 100);
}

function hasSocial(resume: ResumeDocument, platform: string): boolean {
  return resume.socialLinks.some(
    (l) => l.platform.toLowerCase() === platform.toLowerCase() && l.url.trim().length > 4
  );
}

function allText(resume: ResumeDocument): string {
  const parts = [
    resume.summary,
    resume.skills.join(" "),
    ...resume.experience.flatMap((e) => [e.position, e.company, ...e.bullets]),
    ...resume.projects.flatMap((p) => [p.name, p.description, ...p.technologies]),
    ...resume.education.map((e) => `${e.degree} ${e.field} ${e.institution}`),
  ];
  return parts.join(" ").toLowerCase();
}

function analyzeHeader(resume: ResumeDocument, type: ResumeType): SectionAnalysis {
  const { personal: p } = resume;
  const checks: ValidationCheck[] = [];

  checks.push(
    p.firstName && p.lastName
      ? check("name", "pass", "checks.header.namePass")
      : check("name", "fail", "checks.header.nameFail", "checks.header.nameSuggest")
  );
  checks.push(
    p.headline
      ? check("headline", "pass", "checks.header.headlinePass")
      : check("headline", "fail", "checks.header.headlineFail", "checks.header.headlineSuggest")
  );
  checks.push(
    p.phone
      ? check("phone", "pass", "checks.header.phonePass")
      : check("phone", "fail", "checks.header.phoneFail", "checks.header.phoneSuggest")
  );
  checks.push(
    p.email && p.email.includes("@")
      ? check("email", "pass", "checks.header.emailPass")
      : check("email", "fail", "checks.header.emailFail", "checks.header.emailSuggest")
  );
  checks.push(
    p.city && p.country
      ? check("location", "pass", "checks.header.locationPass")
      : check("location", "warning", "checks.header.locationWarn", "checks.header.locationSuggest")
  );
  checks.push(
    hasSocial(resume, "LinkedIn")
      ? check("linkedin", "pass", "checks.header.linkedinPass")
      : check("linkedin", "fail", "checks.header.linkedinFail", "checks.header.linkedinSuggest")
  );
  checks.push(
    hasSocial(resume, "GitHub")
      ? check("github", "pass", "checks.header.githubPass")
      : check("github", "fail", "checks.header.githubFail", "checks.header.githubSuggest")
  );
  checks.push(
    hasSocial(resume, "Portfolio")
      ? check("portfolio", "pass", "checks.header.portfolioPass")
      : check(
          "portfolio",
          type === "werkstudent" ? "fail" : "warning",
          type === "werkstudent" ? "checks.header.portfolioFail" : "checks.header.portfolioWarn",
          "checks.header.portfolioSuggest"
        )
  );

  return { id: "header", titleKey: "sections.header", score: sectionScore(checks), checks };
}

function analyzeSummary(resume: ResumeDocument): SectionAnalysis {
  const s = resume.summary.trim();
  const checks: ValidationCheck[] = [];
  const len = s.length;

  if (len < 40) {
    checks.push(check("length", "fail", "checks.summary.tooShort", "checks.summary.tooShortSuggest"));
  } else if (len > 600) {
    checks.push(check("length", "warning", "checks.summary.tooLong", "checks.summary.tooLongSuggest"));
  } else {
    checks.push(check("length", "pass", "checks.summary.lengthPass"));
  }

  const hasYears = /(\d+\+?\s*(years|jahre|jahr))|(\d+\s*\+)/i.test(s);
  checks.push(
    hasYears
      ? check("experience", "pass", "checks.summary.yearsPass")
      : check("experience", "warning", "checks.summary.yearsWarn", "checks.summary.yearsSuggest")
  );

  const hasTech = ATS_KEYWORDS.some((k) => s.toLowerCase().includes(k));
  checks.push(
    hasTech
      ? check("tech", "pass", "checks.summary.techPass")
      : check("tech", "warning", "checks.summary.techWarn", "checks.summary.techSuggest")
  );

  const generic = /hard.?working|team player|motivated|quick learner/i.test(s);
  if (generic) {
    checks.push(check("generic", "warning", "checks.summary.genericWarn", "checks.summary.genericSuggest"));
  } else if (len >= 40) {
    checks.push(check("generic", "pass", "checks.summary.specificPass"));
  }

  return { id: "summary", titleKey: "sections.summary", score: sectionScore(checks), checks };
}

function analyzeSkills(resume: ResumeDocument): SectionAnalysis {
  const checks: ValidationCheck[] = [];
  const skills = resume.skills;
  const text = allText(resume);

  checks.push(
    skills.length >= 5
      ? check("count", "pass", "checks.skills.countPass")
      : skills.length >= 3
        ? check("count", "warning", "checks.skills.countWarn", "checks.skills.countSuggest")
        : check("count", "fail", "checks.skills.countFail", "checks.skills.countSuggest")
  );

  const matched = ATS_KEYWORDS.filter((k) =>
    skills.some((s) => s.toLowerCase().includes(k)) || text.includes(k)
  );
  checks.push(
    matched.length >= 6
      ? check("ats", "pass", "checks.skills.atsPass")
      : check("ats", "warning", "checks.skills.atsWarn", "checks.skills.atsSuggest")
  );

  const hasFrontend = /react|next|vue|angular|tailwind/i.test(skills.join(" "));
  const hasBackend = /node|express|nest|django|spring/i.test(skills.join(" "));
  checks.push(
    hasFrontend && hasBackend
      ? check("fullstack", "pass", "checks.skills.fullstackPass")
      : check("fullstack", "warning", "checks.skills.fullstackWarn", "checks.skills.fullstackSuggest")
  );

  return { id: "skills", titleKey: "sections.skills", score: sectionScore(checks), checks };
}

function analyzeExperience(resume: ResumeDocument, type: ResumeType): SectionAnalysis {
  const checks: ValidationCheck[] = [];
  const exp = resume.experience;

  if (type === "professional") {
    checks.push(
      exp.length >= 1
        ? check("count", "pass", "checks.experience.countPass")
        : check("count", "fail", "checks.experience.countFail", "checks.experience.countSuggest")
    );
  } else {
    checks.push(
      exp.length >= 1
        ? check("count", "pass", "checks.experience.countPass")
        : check("count", "warning", "checks.experience.werkstudentWarn", "checks.experience.werkstudentSuggest")
    );
  }

  const bullets = exp.flatMap((e) => e.bullets.filter(Boolean));
  const withMetrics = bullets.filter((b) => METRIC_PATTERN.test(b)).length;
  checks.push(
    bullets.length >= 2 && withMetrics >= 1
      ? check("metrics", "pass", "checks.experience.metricsPass")
      : check("metrics", "warning", "checks.experience.metricsWarn", "checks.experience.metricsSuggest")
  );

  const withVerbs = bullets.filter((b) =>
    ACTION_VERBS.some((v) => b.toLowerCase().startsWith(v))
  ).length;
  checks.push(
    withVerbs >= 1
      ? check("verbs", "pass", "checks.experience.verbsPass")
      : check("verbs", "warning", "checks.experience.verbsWarn", "checks.experience.verbsSuggest")
  );

  const complete = exp.filter((e) => e.company && e.position && e.startDate).length;
  checks.push(
    complete === exp.length && exp.length > 0
      ? check("structure", "pass", "checks.experience.structurePass")
      : exp.length === 0
        ? check("structure", "fail", "checks.experience.structureFail")
        : check("structure", "warning", "checks.experience.structureWarn", "checks.experience.structureSuggest")
  );

  return { id: "experience", titleKey: "sections.experience", score: sectionScore(checks), checks };
}

function analyzeProjects(resume: ResumeDocument, type: ResumeType): SectionAnalysis {
  const checks: ValidationCheck[] = [];
  const projects = resume.projects;

  if (type === "werkstudent") {
    checks.push(
      projects.length >= 2
        ? check("count", "pass", "checks.projects.werkstudentPass")
        : projects.length >= 1
          ? check("count", "warning", "checks.projects.werkstudentWarn", "checks.projects.werkstudentSuggest")
          : check("count", "fail", "checks.projects.werkstudentFail", "checks.projects.werkstudentSuggest")
    );
  } else {
    checks.push(
      projects.length >= 1
        ? check("count", "pass", "checks.projects.countPass")
        : check("count", "warning", "checks.projects.countWarn", "checks.projects.countSuggest")
    );
  }

  const withTech = projects.filter((p) => p.technologies.length >= 2).length;
  checks.push(
    withTech >= 1 || projects.length === 0
      ? projects.length > 0
        ? check("stack", "pass", "checks.projects.stackPass")
        : check("stack", "warning", "checks.projects.stackWarn")
      : check("stack", "warning", "checks.projects.stackWarn", "checks.projects.stackSuggest")
  );

  const withDesc = projects.filter((p) => p.description.length > 30).length;
  checks.push(
    withDesc >= 1 || projects.length === 0
      ? projects.length > 0
        ? check("desc", "pass", "checks.projects.descPass")
        : check("desc", "fail", "checks.projects.descFail")
      : check("desc", "warning", "checks.projects.descWarn", "checks.projects.descSuggest")
  );

  return { id: "projects", titleKey: "sections.projects", score: sectionScore(checks), checks };
}

function analyzeEducation(resume: ResumeDocument): SectionAnalysis {
  const checks: ValidationCheck[] = [];
  const edu = resume.education;

  checks.push(
    edu.length >= 1
      ? check("count", "pass", "checks.education.countPass")
      : check("count", "fail", "checks.education.countFail", "checks.education.countSuggest")
  );

  const complete = edu.filter((e) => e.institution && e.degree).length;
  checks.push(
    complete === edu.length && edu.length > 0
      ? check("structure", "pass", "checks.education.structurePass")
      : check("structure", "warning", "checks.education.structureWarn", "checks.education.structureSuggest")
  );

  return { id: "education", titleKey: "sections.education", score: sectionScore(checks), checks };
}

function analyzeLanguages(resume: ResumeDocument): SectionAnalysis {
  const checks: ValidationCheck[] = [];
  const langs = resume.languages;

  checks.push(
    langs.length >= 1
      ? check("count", "pass", "checks.languages.countPass")
      : check("count", "fail", "checks.languages.countFail", "checks.languages.countSuggest")
  );

  const hasGerman = langs.some((l) => /german|deutsch/i.test(l.name));
  const hasEnglish = langs.some((l) => /english|englisch/i.test(l.name));
  checks.push(
    hasGerman
      ? check("german", "pass", "checks.languages.germanPass")
      : check("german", "fail", "checks.languages.germanFail", "checks.languages.germanSuggest")
  );
  checks.push(
    hasEnglish
      ? check("english", "pass", "checks.languages.englishPass")
      : check("english", "warning", "checks.languages.englishWarn", "checks.languages.englishSuggest")
  );

  const withLevel = langs.filter((l) => l.level).length;
  checks.push(
    withLevel === langs.length && langs.length > 0
      ? check("level", "pass", "checks.languages.levelPass")
      : check("level", "warning", "checks.languages.levelWarn", "checks.languages.levelSuggest")
  );

  return { id: "languages", titleKey: "sections.languages", score: sectionScore(checks), checks };
}

function analyzeWerkstudent(resume: ResumeDocument): SectionAnalysis {
  const w = resume.werkstudent ?? {
    visaStatus: "",
    taxId: "",
    availability: "",
    universityEnrollment: "",
  };
  const checks: ValidationCheck[] = [];

  checks.push(
    w.visaStatus.trim()
      ? check("visa", "pass", "checks.werkstudent.visaPass")
      : check("visa", "fail", "checks.werkstudent.visaFail", "checks.werkstudent.visaSuggest")
  );
  checks.push(
    w.taxId.trim()
      ? check("tax", "pass", "checks.werkstudent.taxPass")
      : check("tax", "fail", "checks.werkstudent.taxFail", "checks.werkstudent.taxSuggest")
  );
  checks.push(
    w.availability.trim()
      ? check("availability", "pass", "checks.werkstudent.availabilityPass")
      : check("availability", "fail", "checks.werkstudent.availabilityFail", "checks.werkstudent.availabilitySuggest")
  );
  checks.push(
    w.universityEnrollment.trim()
      ? check("enrollment", "pass", "checks.werkstudent.enrollmentPass")
      : check("enrollment", "fail", "checks.werkstudent.enrollmentFail", "checks.werkstudent.enrollmentSuggest")
  );

  return { id: "werkstudent", titleKey: "sections.werkstudent", score: sectionScore(checks), checks };
}

function analyzeFormat(resume: ResumeDocument): SectionAnalysis {
  const checks: ValidationCheck[] = [];

  checks.push(
    resume.templateId === "german-ats" || resume.templateId === "minimal" || resume.templateId === "corporate"
      ? check("template", "pass", "checks.format.templatePass")
      : check("template", "warning", "checks.format.templateWarn", "checks.format.templateSuggest")
  );

  const estimatedPages =
    resume.summary.length / 500 +
    resume.experience.length * 0.4 +
    resume.projects.length * 0.3 +
    resume.education.length * 0.2;
  checks.push(
    estimatedPages <= 2
      ? check("length", "pass", "checks.format.lengthPass")
      : check("length", "warning", "checks.format.lengthWarn", "checks.format.lengthSuggest")
  );

  checks.push(check("layout", "pass", "checks.format.layoutPass"));

  return { id: "format", titleKey: "sections.format", score: sectionScore(checks), checks };
}

function computeScores(sections: SectionAnalysis[]): ResumeAnalysisReport["scores"] {
  const avg = (ids: string[]) => {
    const filtered = sections.filter((s) => ids.includes(s.id));
    if (!filtered.length) return 0;
    return Math.round(filtered.reduce((a, s) => a + s.score, 0) / filtered.length);
  };

  const ats = avg(["header", "summary", "skills", "format", "experience"]);
  const germanHr = avg(["header", "languages", "summary", "education", "format"]);
  const technical = avg(["skills", "experience", "projects"]);
  const hiringReadiness = Math.round((ats + germanHr + technical) / 3);

  return { ats, germanHr, technical, hiringReadiness };
}

function buildLists(
  sections: SectionAnalysis[],
  resume: ResumeDocument
): Pick<
  ResumeAnalysisReport,
  "strengths" | "weaknesses" | "missingKeywords" | "missingSections" | "suggestions" | "atsTips"
> {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const suggestions: string[] = [];
  const missingSections: string[] = [];
  const atsTips: string[] = [];

  for (const sec of sections) {
    for (const c of sec.checks) {
      if (c.status === "pass") strengths.push(`${sec.id}.${c.id}`);
      if (c.status === "fail") weaknesses.push(`${sec.id}.${c.id}`);
      if (c.suggestionKey) suggestions.push(c.suggestionKey);
    }
    if (sec.score < 50) missingSections.push(sec.id);
  }

  const text = allText(resume);
  const missingKeywords = ATS_KEYWORDS.filter(
    (k) => !text.includes(k) && !resume.skills.some((s) => s.toLowerCase().includes(k))
  ).slice(0, 8);

  atsTips.push("tips.useActionVerbs", "tips.addMetrics", "tips.keepOneColumn", "tips.pdfExport");

  return { strengths, weaknesses, missingKeywords, missingSections, suggestions, atsTips };
}

function verdictKey(scores: ResumeAnalysisReport["scores"], type: ResumeType): string {
  const avg = scores.hiringReadiness;
  if (avg >= 85) return type === "werkstudent" ? "verdict.excellentWerkstudent" : "verdict.excellent";
  if (avg >= 70) return "verdict.good";
  if (avg >= 55) return "verdict.needsWork";
  return "verdict.critical";
}

export function analyzeResume(resume: ResumeDocument): ResumeAnalysisReport {
  const type = resume.resumeType ?? "professional";

  const sections: SectionAnalysis[] = [
    analyzeHeader(resume, type),
    analyzeSummary(resume),
    analyzeSkills(resume),
    analyzeExperience(resume, type),
    analyzeProjects(resume, type),
    analyzeEducation(resume),
    analyzeLanguages(resume),
    analyzeFormat(resume),
  ];

  if (type === "werkstudent") {
    sections.push(analyzeWerkstudent(resume));
  }

  const scores = computeScores(sections);
  const lists = buildLists(sections, resume);

  return {
    resumeType: type,
    verdictKey: verdictKey(scores, type),
    scores,
    sections,
    ...lists,
  };
}
