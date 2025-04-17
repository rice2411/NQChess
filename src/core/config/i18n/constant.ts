export const defaultLocale = "vi" as const
export const locales = ["vi", "en"] as const
export type Locale = (typeof locales)[number]

export const languageNames: Record<Locale, string> = {
  vi: "Tiếng Việt",
  en: "English",
}

export const LANGUAGE_FLAGS = {
  en: "US",
  vi: "VN",
} as const
