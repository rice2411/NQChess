import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import enMessages from "./messages/en.json"
import viMessages from "./messages/vi.json"
import { defaultLocale, locales } from "./constant"

// Get language from URL or use default
const getLanguage = () => {
  if (typeof window === "undefined") return defaultLocale
  const path = window.location.pathname
  const pathLocale = path.split("/")[1]
  return locales.includes(pathLocale as any) ? pathLocale : defaultLocale
}

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enMessages,
    },
    vi: {
      translation: viMessages,
    },
  },
  lng: getLanguage(),
  fallbackLng: defaultLocale,
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
