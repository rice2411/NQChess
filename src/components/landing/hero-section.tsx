import { Button } from "@/shared/components/ui/button"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { LANDING_PATHS } from "./landing.constants"

interface HeroSectionProps {
  locale: string
}

export function HeroSection({ locale }: HeroSectionProps) {
  const t = useTranslations("common")
  const tAuth = useTranslations("auth")

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
          {t("welcome.title")}
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-200 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          {t("welcome.description")}
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div className="rounded-md shadow">
            <Link href={`/${locale}${LANDING_PATHS.LOGIN}`}>
              <Button size="lg" variant="primary" className="w-full">
                {tAuth("forms.login")}
              </Button>
            </Link>
          </div>
          <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
            <Link href={`/${locale}${LANDING_PATHS.REGISTER}`}>
              <Button size="lg" variant="secondary" className="w-full">
                {tAuth("forms.register")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
