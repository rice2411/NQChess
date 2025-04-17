import { useTranslations } from "next-intl"
import Link from "next/link"
import { LANDING_PATHS } from "@/components/landing/landing.constants"

interface MobileMenuProps {
  locale: string
  isOpen: boolean
}

export function MobileMenu({ locale, isOpen }: MobileMenuProps) {
  const t = useTranslations("common")

  return (
    <div
      className={`md:hidden ${
        isOpen ? "block" : "hidden"
      } transition-all duration-300 ease-in-out`}
    >
      <div className="px-2 pt-2 pb-3 space-y-1">
        <Link
          href={`/${locale}${LANDING_PATHS.MANAGEMENT}`}
          className="block text-gray-200 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          {t("features.management.title")}
        </Link>
        <Link
          href={`/${locale}${LANDING_PATHS.TRACKING}`}
          className="block text-gray-200 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          {t("features.tracking.title")}
        </Link>
        <Link
          href={`/${locale}${LANDING_PATHS.REPORTING}`}
          className="block text-gray-200 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          {t("features.reporting.title")}
        </Link>
        <Link
          href={`/${locale}${LANDING_PATHS.API_DOCS}`}
          className="block text-gray-200 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          {t("features.api.title")}
        </Link>
      </div>
    </div>
  )
}
