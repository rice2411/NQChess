import { getServerSession } from "next-auth"
import { authOptions } from "@/core/config/next-auth.config"
import LandingPage from "@/components/landing/landing-page"
import { IUser } from "@/modules/user/interfaces/user.interface"
import { Navbar } from "@/shared/components/layout/navbar"

export default async function Home({ params }: { params: { locale: string } }) {
  const [session, { locale }] = await Promise.all([
    getServerSession(authOptions),
    Promise.resolve(params),
  ])

  return (
    <>
      <Navbar locale={locale} user={session?.user as IUser} />
      <LandingPage locale={locale} />
    </>
  )
}
