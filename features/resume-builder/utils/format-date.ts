export function formatMonthYear(value: string, locale = "en"): string {
  if (!value) return "";
  const [year, month] = value.split("-");
  if (!year) return value;
  if (!month) return year;
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString(locale === "de" ? "de-DE" : "en-US", {
    month: "short",
    year: "numeric",
  });
}

export function formatDateInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 6);
  if (digits.length <= 4) return digits;
  return `${digits.slice(0, 4)}-${digits.slice(4)}`;
}
