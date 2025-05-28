export const getLocale = () => {
  if (typeof window === "undefined") return
  const locale = localStorage.getItem("locale")
  return locale || "vi"
}

export const setLocale = (locale: string) => {
  localStorage.setItem("locale", locale)
}

export const createLocaleLink = (link: string) => {
  return `/vi/${link}`
}
