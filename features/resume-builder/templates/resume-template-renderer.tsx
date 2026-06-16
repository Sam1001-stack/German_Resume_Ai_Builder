"use client";

import { motion } from "framer-motion";
import type { ResumeDocument, TemplateId } from "@/types/resume-builder";
import { formatMonthYear } from "@/features/resume-builder/utils/format-date";
import { resumePreviewLabel } from "@/lib/locale-utils";
import { useLocale } from "next-intl";
import { DeveloperSkillsPreview } from "@/features/resume-builder/components/developer-skills-preview";
import { isDeveloperSkillsMode } from "@/features/resume-builder/utils/developer-skills-mode";

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
    { label: resumePreviewLabel(locale, "availability"), value: werkstudent?.availability ?? "" },
    { label: resumePreviewLabel(locale, "enrollment"), value: werkstudent?.universityEnrollment ?? "" },
  ];

  const isWerkstudent = resumeType === "werkstudent";

  const sp = {
    headerBorder: isWerkstudent ? "pb-2" : "pb-4",
    nameSize: isWerkstudent ? "text-xl" : "text-2xl",
    headlineSize: isWerkstudent ? "text-xs" : "text-sm",
    sectionMt: isWerkstudent ? "mt-3" : "mt-5",
    werkMt: isWerkstudent ? "mt-2" : "mt-4",
    h2: isWerkstudent
      ? "mb-1 text-[10px] font-bold uppercase tracking-wider"
      : "mb-2 text-xs font-bold uppercase tracking-widest",
    body: isWerkstudent ? "text-[10px] leading-snug" : "text-[11px] leading-relaxed",
    small: isWerkstudent ? "text-[9px]" : "text-[10px]",
    tiny: isWerkstudent ? "text-[8px]" : "text-[9px]",
    expGap: isWerkstudent ? "space-y-2" : "space-y-4",
    itemMb: isWerkstudent ? "mb-1" : "mb-2",
    listMt: isWerkstudent ? "mt-0.5" : "mt-1",
    contactGap: isWerkstudent ? "gap-0.5" : "gap-1",
    contactText: isWerkstudent ? "text-[10px]" : "text-xs",
    dualGridGap: isWerkstudent ? "gap-3" : "gap-4",
    corpBarMb: isWerkstudent ? "mb-3" : "mb-6",
    startupMb: isWerkstudent ? "mb-2" : "mb-4",
  };

  const baseClass =
    "mx-auto bg-white text-zinc-900 shadow-2xl print:shadow-none";
  const a4Style = {
    width: "210mm",
    minHeight: "297mm",
    transform: scale !== 1 ? `scale(${scale})` : undefined,
    transformOrigin: "top center",
  };

  const dateFmt = (d: string) => formatMonthYear(d, locale);
  const locationLine = [personal.address, personal.city, personal.country].filter(Boolean).join(", ");

  const content = (
    <>
      <header
        className={`border-b-2 ${sp.headerBorder}`}
        style={{ borderColor: theme.primary }}
      >
        <h1 className={`${sp.nameSize} font-bold tracking-tight`} style={{ color: theme.primary }}>
          {fullName || "Your Name"}
        </h1>
        {personal.headline && (
          <p className={`mt-0.5 ${sp.headlineSize} font-medium text-zinc-600`}>{personal.headline}</p>
        )}
        <p
          className="mt-1.5 inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
          style={{ backgroundColor: `${theme.primary}18`, color: theme.primary }}
        >
          {typeLabel}
        </p>
        <div className={`mt-1.5 flex flex-col ${sp.contactGap} ${sp.contactText} text-zinc-600`}>
          {resume.socialLinks.length > 0 && (
            <div className={`grid grid-cols-2 gap-x-3 gap-y-0.5 ${sp.tiny} text-zinc-500`}>
              {resume.socialLinks.map((s) => (
                <span key={s.id} className="truncate">
                  <b>{s.platform}:</b> {s.url.replace(/^https?:\/\//, "")}
                </span>
              ))}
            </div>
          )}
          <div className="flex flex-wrap gap-x-3 gap-y-0.5">
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && <span>{personal.phone}</span>}
          </div>
          {locationLine && <span>{locationLine}</span>}
          {personal.willingToRelocate === true && (
            <span className="font-medium text-zinc-700">
              {resumePreviewLabel(locale, "willingToRelocate")}
            </span>
          )}
        </div>
      </header>

      {isWerkstudent && (
        <section className={sp.werkMt}>
          <h2 className={sp.h2} style={{ color: theme.primary }}>
            {resumePreviewLabel(locale, "werkstudent")}
          </h2>
          <div className={`grid grid-cols-1 gap-x-4 gap-y-0.5 sm:grid-cols-3 ${sp.small} text-zinc-700`}>
            {werkstudentRows.map((row) => (
              <div key={row.label} className="min-w-0">
                <span className="font-semibold text-zinc-600">{row.label}: </span>
                <span className={row.value.trim() ? "" : "italic text-zinc-400"}>
                  {row.value.trim() || "—"}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.summary && (
        <section className={sp.sectionMt}>
          <h2 className={sp.h2} style={{ color: theme.primary }}>
            {resumePreviewLabel(locale, "summary")}
          </h2>
          <p className={`${sp.body} text-zinc-700`}>{resume.summary}</p>
        </section>
      )}

      {(resume.skills.length > 0 || isDeveloperSkillsMode(resume)) && (
        <section className={sp.sectionMt}>
          <h2 className={sp.h2} style={{ color: theme.primary }}>
            {resumePreviewLabel(locale, "skills")}
          </h2>
          {isDeveloperSkillsMode(resume) ? (
            <div className={isWerkstudent ? "space-y-1.5" : "space-y-2.5"}>
              <DeveloperSkillsPreview resume={resume} compact={isWerkstudent} />
            </div>
          ) : (
            <p className={`${sp.body} text-zinc-700`}>{resume.skills.join(" · ")}</p>
          )}
        </section>
      )}

      {resume.experience.length > 0 && (
        <section className={sp.sectionMt}>
          <h2 className={sp.h2} style={{ color: theme.primary }}>
            {resumePreviewLabel(locale, "experience")}
          </h2>
          <div className={sp.expGap}>
            {resume.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between gap-2">
                  <div>
                    <p className={`${sp.body} font-semibold`}>{exp.position}</p>
                    <p className={`${sp.small} text-zinc-600`}>
                      {exp.company}
                      {exp.location ? ` · ${exp.location}` : ""}
                    </p>
                  </div>
                  <p className={`shrink-0 ${sp.small} text-zinc-500`}>
                    {dateFmt(exp.startDate)}
                    {" – "}
                    {exp.current ? resumePreviewLabel(locale, "present") : dateFmt(exp.endDate)}
                  </p>
                </div>
                {exp.bullets.length > 0 && (
                  <ul className={`${sp.listMt} list-disc pl-4 ${sp.small} leading-snug text-zinc-700`}>
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
        <section className={sp.sectionMt}>
          <h2 className={sp.h2} style={{ color: theme.primary }}>
            {resumePreviewLabel(locale, "education")}
          </h2>
          {resume.education.map((edu) => {
            const start = dateFmt(edu.startDate);
            const end = edu.current ? resumePreviewLabel(locale, "present") : dateFmt(edu.endDate);
            const dateRange = start && end ? `${start} – ${end}` : start || end || "";

            return (
            <div key={edu.id} className={sp.itemMb}>
              <p className={`${sp.body} font-semibold`}>
                {edu.degree} {edu.field && `— ${edu.field}`}
              </p>
              <p className={`${sp.small} text-zinc-600`}>
                {edu.institution}
                {dateRange ? ` · ${dateRange}` : ""}
              </p>
            </div>
            );
          })}
        </section>
      )}

      {resume.projects.length > 0 && (
        <section className={sp.sectionMt}>
          <h2 className={sp.h2} style={{ color: theme.primary }}>
            {resumePreviewLabel(locale, "projects")}
          </h2>
          {resume.projects.map((p) => {
            const descriptionLines = p.description
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean);
            return (
            <div key={p.id} className={sp.itemMb}>
              <p className={`${sp.body} font-semibold`}>{p.name}</p>
              {descriptionLines.length > 1 ? (
                <ul className={`${sp.listMt} list-disc pl-4 ${sp.small} leading-snug text-zinc-700`}>
                  {descriptionLines.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              ) : (
                p.description && (
                  <p className={`${sp.small} text-zinc-700`}>{p.description}</p>
                )
              )}
              {p.technologies.length > 0 && (
                <p className={`${sp.tiny} text-zinc-500`}>{p.technologies.join(", ")}</p>
              )}
            </div>
            );
          })}
        </section>
      )}

      {(resume.languages.length > 0 || resume.certifications.length > 0) && (
        <section className={`${sp.sectionMt} grid grid-cols-2 ${sp.dualGridGap}`}>
          {resume.languages.length > 0 && (
            <div>
              <h2 className={sp.h2} style={{ color: theme.primary }}>
                {resumePreviewLabel(locale, "languages")}
              </h2>
              {resume.languages.map((l) => (
                <p key={l.id} className={sp.small}>
                  {l.name} — {l.level}
                </p>
              ))}
            </div>
          )}
          {resume.certifications.length > 0 && (
            <div>
              <h2 className={sp.h2} style={{ color: theme.primary }}>
                {resumePreviewLabel(locale, "certifications")}
              </h2>
              {resume.certifications.map((c) => (
                <p key={c.id} className={sp.small}>
                  {c.name} — {c.issuer}
                </p>
              ))}
            </div>
          )}
        </section>
      )}

    </>
  );

  const templateStyles: Record<TemplateId, string> = {
    "german-ats": isWerkstudent ? "p-7 font-[family-name:var(--font-inter)]" : "p-10 font-[family-name:var(--font-inter)]",
    minimal: isWerkstudent ? "p-9 font-light" : "p-12 font-light",
    corporate: isWerkstudent ? "p-7 bg-zinc-50" : "p-10 bg-zinc-50",
    creative: isWerkstudent ? "p-6 border-l-8" : "p-8 border-l-8",
    startup: isWerkstudent ? "p-7 rounded-sm" : "p-10 rounded-sm",
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
          className={`${sp.corpBarMb} h-1 w-16 rounded`}
          style={{ backgroundColor: theme.primary }}
        />
      )}
      {templateId === "startup" && (
        <div className={`${sp.startupMb} flex items-center gap-2`}>
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