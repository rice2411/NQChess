import { getTranslations } from "next-intl/server"
import NavigationLinks from "@/shared/components/navigation-links.client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/core/config/next-auth.config"

export default async function Home() {
  const t = await getTranslations("common")
  const tAuth = await getTranslations("auth")
  const session = await getServerSession(authOptions)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">{t("welcome.title")}</h1>
        <NavigationLinks
          user={session?.user || null}
          translations={{
            apiDocument: t("navigation.apiDocument"),
            login: tAuth("forms.login"),
          }}
        />
      </div>
    </main>
  )
}
