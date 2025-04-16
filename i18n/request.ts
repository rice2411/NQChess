import { getRequestConfig } from "next-intl/server"
import { defaultLocale, locales } from "../src/core/config/i18n/constant"

export default getRequestConfig(async (request) => {
  const locale = await request.requestLocale

  console.log("locale:", locale)
  // Kiểm tra và sử dụng locale hợp lệ
  const validLocale = locale || defaultLocale

  if (!locales.includes(validLocale as any)) {
    console.warn(
      `Invalid locale: ${validLocale}, falling back to ${defaultLocale}`
    )
    return {
      messages: (
        await import(`../src/core/config/i18n/messages/${defaultLocale}.json`)
      ).default,
      locale: defaultLocale,
      timeZone: "Asia/Ho_Chi_Minh",
    }
  }

  const messages = (
    await import(`../src/core/config/i18n/messages/${validLocale}.json`)
  ).default

  return {
    messages,
    locale: validLocale,
    timeZone: "Asia/Ho_Chi_Minh",
  }
})
