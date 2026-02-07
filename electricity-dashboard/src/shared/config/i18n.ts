export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", dir: "ltr" },
  { code: "fa", label: "فارسی", dir: "rtl" },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];

export function getLanguageDir(lang: string): "ltr" | "rtl" {
  return lang === "fa" ? "rtl" : "ltr";
}
