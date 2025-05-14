import createMiddleware from "next-intl/middleware"
import { locales, defaultLocale } from "./core/config/i18n/constant"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default createMiddleware({
  // A list of all locales that are supported
  locales,
  // Used when no locale matches
  defaultLocale,
  // Domains
  domains: [
    {
      domain: "localhost",
      defaultLocale: "vi",
      // Optionally restrict the locales managed by this domain
      locales: ["en", "vi"],
    },
  ],
})

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(vi|en)/:path*"],
}

// Handle not found pages
export async function notFound(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const locale = pathname.split("/")[1] || defaultLocale

  // Redirect to not-found page with proper locale
  return NextResponse.redirect(new URL(`/${locale}/not-found`, request.url))
}
