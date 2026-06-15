/** Split paragraph text into bullet lines at sentence boundaries (full stops). */
export function paragraphToBulletLines(text: string): string[] {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return [];

  return normalized
    .split(/\.+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .map((sentence) => `${sentence}.`);
}
