import createMiddleware from "next-intl/middleware"
import { locales, defaultLocale } from "./core/config/i18n/constant"

export default createMiddleware({
  // A list of all locales that are supported
  locales,
  // Used when no locale matches
  defaultLocale,
  // Domains
  domains: [
    {
      domain: "localhost",
      defaultLocale: "en",
      // Optionally restrict the locales managed by this domain
      locales: ["en", "vi"],
    },
  ],
})

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(vi|en)/:path*"],
}
