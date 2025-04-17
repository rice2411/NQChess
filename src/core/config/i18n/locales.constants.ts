export const SUPPORTED_LOCALES = {
  en: "English",
  vi: "Tiếng Việt",
} as const

export type SupportedLocale = keyof typeof SUPPORTED_LOCALES
