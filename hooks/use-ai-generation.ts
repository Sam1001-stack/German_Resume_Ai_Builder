"use client";

import { useCallback, useState } from "react";

const MOCK_RESPONSES: Record<string, string[]> = {
  summary: [
    "Results-driven professional with proven expertise in delivering scalable solutions and leading cross-functional teams in fast-paced environments.",
    "Erfahrener Fachmann mit nachgewiesener Expertise in der Entwicklung skalierbarer Lösungen und der Führung interdisziplinärer Teams.",
  ],
  improve: [
    "Spearheaded end-to-end delivery of enterprise SaaS features, improving user retention by 28% within two quarters.",
    "Led architecture redesign that reduced infrastructure costs by 35% while maintaining 99.9% uptime.",
  ],
  bullets: [
    "Designed and implemented RESTful APIs serving 2M+ monthly requests with sub-100ms latency.",
    "Mentored junior developers and established code review standards adopted across three teams.",
    "Collaborated with product and design to ship 12 major releases on schedule.",
  ],
  skills: ["TypeScript", "React", "Node.js", "AWS", "CI/CD", "Agile", "System Design", "PostgreSQL"],
};

export function useAiGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamedText, setStreamedText] = useState("");

  const generate = useCallback(async (type: keyof typeof MOCK_RESPONSES | string) => {
    setIsGenerating(true);
    setStreamedText("");
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));

    const pool = MOCK_RESPONSES[type] ?? MOCK_RESPONSES.improve;
    const text = Array.isArray(pool)
      ? type === "skills"
        ? pool.join(", ")
        : pool[Math.floor(Math.random() * pool.length)]
      : String(pool);

    let current = "";
    for (const char of text) {
      current += char;
      setStreamedText(current);
      await new Promise((r) => setTimeout(r, 12 + Math.random() * 18));
    }

    setIsGenerating(false);
    return text;
  }, []);

  return { generate, isGenerating, streamedText, resetStream: () => setStreamedText("") };
}
