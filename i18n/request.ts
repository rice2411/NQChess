import { getRequestConfig } from "next-intl/server"
import { defaultLocale, locales } from "../src/core/config/i18n/constant"

export default getRequestConfig(async ({ locale }) => {
  // Kiểm tra và sử dụng locale hợp lệ
  const validLocale =
    locale && locales.includes(locale as any) ? locale : defaultLocale

  const messages = (
    await import(`../src/core/config/i18n/messages/${validLocale}.json`)
  ).default

  return {
    messages,
    locale: validLocale,
    timeZone: "Asia/Ho_Chi_Minh",
  }
})
