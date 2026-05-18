"use client";

import { motion } from "framer-motion";
import type { ResumeDocument, TemplateId } from "@/types/resume-builder";
import { formatMonthYear } from "@/features/resume-builder/utils/format-date";
import { resumePreviewLabel } from "@/lib/locale-utils";
import { useLocale } from "next-intl";

interface Props {
  resume: ResumeDocument;
  scale?: number;
}

export function ResumeTemplateRenderer({ resume, scale = 1 }: Props) {
  const locale = useLocale();
  const { personal, theme, templateId, werkstudent } = resume;
  const resumeType = resume.resumeType ?? "professional";
  const fullName = `${personal.firstName} ${personal.lastName}`.trim();
  const typeLabel =
    resumeType === "werkstudent"
      ? resumePreviewLabel(locale, "resumeTypeWerkstudent")
      : resumePreviewLabel(locale, "resumeTypeProfessional");

  const werkstudentRows = [
    { label: resumePreviewLabel(locale, "visaStatus"), value: werkstudent?.visaStatus ?? "" },
    { label: resumePreviewLabel(locale, "taxId"), value: werkstudent?.taxId ?? "" },
    { label: resumePreviewLabel(locale, "availability"), value: werkstudent?.availability ?? "" },
    { label: resumePreviewLabel(locale, "enrollment"), value: werkstudent?.universityEnrollment ?? "" },
  ];

  const baseClass =
    "mx-auto bg-white text-zinc-900 shadow-2xl print:shadow-none";
  const a4Style = {
    width: "210mm",
    minHeight: "297mm",
    transform: scale !== 1 ? `scale(${scale})` : undefined,
    transformOrigin: "top center",
  };

  const dateFmt = (d: string) => formatMonthYear(d, locale);

  const content = (
    <>
      <header
        className="border-b-2 pb-4"
        style={{ borderColor: theme.primary }}
      >
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: theme.primary }}>
          {fullName || "Your Name"}
        </h1>
        {personal.headline && (
          <p className="mt-1 text-sm font-medium text-zinc-600">{personal.headline}</p>
        )}
        <p
          className="mt-2 inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
          style={{ backgroundColor: `${theme.primary}18`, color: theme.primary }}
        >
          {typeLabel}
        </p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-600">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {(personal.city || personal.country) && (
            <span>
              {[personal.address, personal.city, personal.country].filter(Boolean).join(", ")}
            </span>
          )}
        </div>
      </header>

      {resumeType === "werkstudent" && (
        <section className="mt-4">
          <h2
            className="mb-2 text-xs font-bold uppercase tracking-widest"
            style={{ color: theme.primary }}
          >
            {resumePreviewLabel(locale, "werkstudent")}
          </h2>
          <dl className="space-y-1 text-[10px] text-zinc-700">
            {werkstudentRows.map((row) => (
              <div key={row.label} className="flex gap-2">
                <dt className="min-w-[7rem] shrink-0 font-semibold text-zinc-600">{row.label}:</dt>
                <dd className={row.value.trim() ? "" : "text-zinc-400 italic"}>
                  {row.value.trim() || "—"}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {resume.summary && (
        <section className="mt-5">
          <h2
            className="mb-2 text-xs font-bold uppercase tracking-widest"
            style={{ color: theme.primary }}
          >
            {resumePreviewLabel(locale, "summary")}
          </h2>
          <p className="text-[11px] leading-relaxed text-zinc-700">{resume.summary}</p>
        </section>
      )}

      {resume.skills.length > 0 && (
        <section className="mt-5">
          <h2
            className="mb-2 text-xs font-bold uppercase tracking-widest"
            style={{ color: theme.primary }}
          >
            {resumePreviewLabel(locale, "skills")}
          </h2>
          <p className="text-[11px] text-zinc-700">{resume.skills.join(" · ")}</p>
        </section>
      )}

      {resume.experience.length > 0 && (
        <section className="mt-5">
          <h2
            className="mb-2 text-xs font-bold uppercase tracking-widest"
            style={{ color: theme.primary }}
          >
            {resumePreviewLabel(locale, "experience")}
          </h2>
          <div className="space-y-4">
            {resume.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between gap-2">
                  <div>
                    <p className="text-[11px] font-semibold">{exp.position}</p>
                    <p className="text-[10px] text-zinc-600">
                      {exp.company}
                      {exp.location ? ` · ${exp.location}` : ""}
                    </p>
                  </div>
                  <p className="shrink-0 text-[10px] text-zinc-500">
                    {dateFmt(exp.startDate)}
                    {" – "}
                    {exp.current ? resumePreviewLabel(locale, "present") : dateFmt(exp.endDate)}
                  </p>
                </div>
                {exp.bullets.length > 0 && (
                  <ul className="mt-1 list-disc pl-4 text-[10px] leading-relaxed text-zinc-700">
                    {exp.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.education.length > 0 && (
        <section className="mt-5">
          <h2
            className="mb-2 text-xs font-bold uppercase tracking-widest"
            style={{ color: theme.primary }}
          >
            {resumePreviewLabel(locale, "education")}
          </h2>
          {resume.education.map((edu) => (
            <div key={edu.id} className="mb-2">
              <p className="text-[11px] font-semibold">
                {edu.degree} {edu.field && `— ${edu.field}`}
              </p>
              <p className="text-[10px] text-zinc-600">
                {edu.institution} · {dateFmt(edu.startDate)} – {dateFmt(edu.endDate)}
              </p>
            </div>
          ))}
        </section>
      )}

      {resume.projects.length > 0 && (
        <section className="mt-5">
          <h2
            className="mb-2 text-xs font-bold uppercase tracking-widest"
            style={{ color: theme.primary }}
          >
            {resumePreviewLabel(locale, "projects")}
          </h2>
          {resume.projects.map((p) => (
            <div key={p.id} className="mb-2">
              <p className="text-[11px] font-semibold">{p.name}</p>
              <p className="text-[10px] text-zinc-700">{p.description}</p>
              {p.technologies.length > 0 && (
                <p className="text-[9px] text-zinc-500">{p.technologies.join(", ")}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {(resume.languages.length > 0 || resume.certifications.length > 0) && (
        <section className="mt-5 grid grid-cols-2 gap-4">
          {resume.languages.length > 0 && (
            <div>
              <h2
                className="mb-2 text-xs font-bold uppercase tracking-widest"
                style={{ color: theme.primary }}
              >
                {resumePreviewLabel(locale, "languages")}
              </h2>
              {resume.languages.map((l) => (
                <p key={l.id} className="text-[10px]">
                  {l.name} — {l.level}
                </p>
              ))}
            </div>
          )}
          {resume.certifications.length > 0 && (
            <div>
              <h2
                className="mb-2 text-xs font-bold uppercase tracking-widest"
                style={{ color: theme.primary }}
              >
                {resumePreviewLabel(locale, "certifications")}
              </h2>
              {resume.certifications.map((c) => (
                <p key={c.id} className="text-[10px]">
                  {c.name} — {c.issuer}
                </p>
              ))}
            </div>
          )}
        </section>
      )}

      {resume.socialLinks.length > 0 && (
        <section className="mt-5 border-t pt-3 text-[9px] text-zinc-500">
          {resume.socialLinks.map((s) => (
            <span key={s.id} className="mr-3">
              {s.platform}: {s.url.replace(/^https?:\/\//, "")}
            </span>
          ))}
        </section>
      )}
    </>
  );

  const templateStyles: Record<TemplateId, string> = {
    "german-ats": "p-10 font-[family-name:var(--font-inter)]",
    minimal: "p-12 font-light",
    corporate: "p-10 bg-zinc-50",
    creative: "p-8 border-l-8",
    startup: "p-10 rounded-sm",
  };

  const creativeBorder = templateId === "creative" ? { borderLeftColor: theme.primary } : {};

  return (
    <motion.article
      key={`${resume.id}-${resumeType}-${resume.updatedAt}`}
      initial={{ opacity: 0.85 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={`${baseClass} ${templateStyles[templateId]}`}
      style={{ ...a4Style, ...creativeBorder }}
    >
      {templateId === "corporate" && (
        <div
          className="mb-6 h-1 w-16 rounded"
          style={{ backgroundColor: theme.primary }}
        />
      )}
      {templateId === "startup" && (
        <div className="mb-4 flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: theme.accent }}
          />
          <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            Resume
          </span>
        </div>
      )}
      {content}
    </motion.article>
  );
}