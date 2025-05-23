export const getLocale = () => {
  if (!localStorage) return
  const locale = localStorage.getItem("locale")
  return locale
}

export const setLocale = (locale: string) => {
  localStorage.setItem("locale", locale)
}

export const createLocaleLink = (link: string) => {
  return `/${getLocale()}/${link}`
}
