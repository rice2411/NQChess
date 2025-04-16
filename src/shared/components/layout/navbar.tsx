"use client"

import { Button } from "@/shared/components/ui/button"
import { useTranslations } from "next-intl"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { LANDING_PATHS } from "@/components/landing/landing.constants"

interface NavbarProps {
  locale: string
}

export function Navbar({ locale }: NavbarProps) {
  const t = useTranslations("common")
  const tAuth = useTranslations("auth")
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href={`/${locale}`}>
              <Image
                src="/logo/favicon-32x32.png"
                alt="NQ Chess"
                width={40}
                height={40}
                className="rounded-full"
              />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-200 hover:text-white focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop Menu Items */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href={`/${locale}${LANDING_PATHS.MANAGEMENT}`}
                className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-white/10"
              >
                {t("features.management.title")}
              </Link>
              <Link
                href={`/${locale}${LANDING_PATHS.TRACKING}`}
                className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-white/10"
              >
                {t("features.tracking.title")}
              </Link>
              <Link
                href={`/${locale}${LANDING_PATHS.REPORTING}`}
                className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-white/10"
              >
                {t("features.reporting.title")}
              </Link>
              <Link
                href={`/${locale}${LANDING_PATHS.API_DOCS}`}
                className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-white/10"
              >
                {t("features.api.title")}
              </Link>
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              <Link href={`/${locale}${LANDING_PATHS.LOGIN}`}>
                <Button variant="primary" size="sm">
                  {tAuth("forms.login")}
                </Button>
              </Link>
              <Link href={`/${locale}${LANDING_PATHS.REGISTER}`}>
                <Button variant="secondary" size="sm">
                  {tAuth("forms.register")}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden ${
            isMenuOpen ? "block" : "hidden"
          } transition-all duration-300 ease-in-out`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href={`/${locale}${LANDING_PATHS.MANAGEMENT}`}
              className="block text-gray-200 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-white/10"
            >
              {t("features.management.title")}
            </Link>
            <Link
              href={`/${locale}${LANDING_PATHS.TRACKING}`}
              className="block text-gray-200 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-white/10"
            >
              {t("features.tracking.title")}
            </Link>
            <Link
              href={`/${locale}${LANDING_PATHS.REPORTING}`}
              className="block text-gray-200 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-white/10"
            >
              {t("features.reporting.title")}
            </Link>
            <Link
              href={`/${locale}${LANDING_PATHS.API_DOCS}`}
              className="block text-gray-200 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-white/10"
            >
              {t("features.api.title")}
            </Link>
            <div className="pt-4 pb-3 border-t border-white/10">
              <div className="flex flex-col space-y-2">
                <Link href={`/${locale}${LANDING_PATHS.LOGIN}`}>
                  <Button variant="primary" className="w-full">
                    {tAuth("forms.login")}
                  </Button>
                </Link>
                <Link href={`/${locale}${LANDING_PATHS.REGISTER}`}>
                  <Button variant="secondary" className="w-full">
                    {tAuth("forms.register")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
