import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import enMessages from "./messages/en.json"
import viMessages from "./messages/vi.json"
import { defaultLocale } from "./constant"

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enMessages,
    },
    vi: {
      translation: viMessages,
    },
  },
  lng: defaultLocale,
  fallbackLng: defaultLocale,
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
