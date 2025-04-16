import { getRequestConfig } from "next-intl/server"
import { defaultLocale, locales } from "../src/core/config/i18n/constant"

export default getRequestConfig(async (request) => {
  const locale = await request.requestLocale

  // Kiểm tra và sử dụng locale hợp lệ
  const validLocale = locale || defaultLocale

  if (!locales.includes(validLocale as any)) {
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
