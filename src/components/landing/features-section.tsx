"use client"

import { useTranslations } from "next-intl"
import { Cable, BarChart3, BookOpen, Code2 } from "lucide-react"
import Link from "next/link"
import { LANDING_PATHS } from "./landing.constants"

interface FeaturesSectionProps {
  locale: string
}

export function FeaturesSection({ locale }: FeaturesSectionProps) {
  const t = useTranslations("common")

  const features = [
    {
      icon: Cable,
      title: t("features.management.title"),
      description: t("features.management.description"),
      path: LANDING_PATHS.MANAGEMENT,
    },
    {
      icon: BarChart3,
      title: t("features.tracking.title"),
      description: t("features.tracking.description"),
      path: LANDING_PATHS.TRACKING,
    },
    {
      icon: BookOpen,
      title: t("features.reporting.title"),
      description: t("features.reporting.description"),
      path: LANDING_PATHS.REPORTING,
    },
    {
      icon: Code2,
      title: t("features.api.title"),
      description: t("features.api.description"),
      path: LANDING_PATHS.API_DOCS,
    },
  ]

  return (
    <section className="py-20 md:py-32 bg-black/30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t("features.title")}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t("features.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Link
              key={index}
              href={`/${locale}${feature.path}`}
              className="block bg-white/5 backdrop-blur-sm rounded-lg p-6 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-300">{feature.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
