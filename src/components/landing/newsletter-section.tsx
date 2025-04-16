"use client"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { useTranslations } from "next-intl"

export function NewsletterSection() {
  const t = useTranslations("common")

  return (
    <section className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t("newsletter.title")}
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            {t("newsletter.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder={t("newsletter.placeholder")}
              className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
            />
            <Button className="w-full sm:w-auto">
              {t("newsletter.subscribe")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
