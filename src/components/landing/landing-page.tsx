"use client"

import Image from "next/image"
import { HeroSection } from "./hero-section"
import { FeaturesSection } from "./features-section"
import { NewsletterSection } from "./newsletter-section"

interface LandingPageProps {
  locale: string
}

export default function LandingPage({ locale }: LandingPageProps) {
  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/background.jpg"
          alt="Chess background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <HeroSection locale={locale} />
        <FeaturesSection locale={locale} />
        <NewsletterSection />
      </div>
    </div>
  )
}
