import { getServerSession } from "next-auth"
import { authOptions } from "@/core/config/next-auth.config"
import { getTranslations } from "next-intl/server"
import LandingPage from "@/components/landing/landing-page"

export default async function Home({ params }: { params: { locale: string } }) {
  const [session, t, { locale }] = await Promise.all([
    getServerSession(authOptions),
    getTranslations("common"),
    Promise.resolve(params),
  ])

  return <LandingPage locale={locale} />
}
