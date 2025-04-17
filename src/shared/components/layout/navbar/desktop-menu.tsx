import { useTranslations } from "next-intl"
import Link from "next/link"
import { LANDING_PATHS } from "@/components/landing/landing.constants"

interface DesktopMenuProps {
  locale: string
}

export function DesktopMenu({ locale }: DesktopMenuProps) {
  const t = useTranslations("common")

  return (
    <div className="hidden md:flex md:items-center md:space-x-4 lg:space-x-6">
      <Link
        href={`/${locale}${LANDING_PATHS.MANAGEMENT}`}
        className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
      >
        {t("features.management.title")}
      </Link>
      <Link
        href={`/${locale}${LANDING_PATHS.TRACKING}`}
        className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
      >
        {t("features.tracking.title")}
      </Link>
      <Link
        href={`/${locale}${LANDING_PATHS.REPORTING}`}
        className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
      >
        {t("features.reporting.title")}
      </Link>
      <Link
        href={`/${locale}${LANDING_PATHS.API_DOCS}`}
        className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
      >
        {t("features.api.title")}
      </Link>
    </div>
  )
}
