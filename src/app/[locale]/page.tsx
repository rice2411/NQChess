import { getServerSession } from "next-auth"
import { authOptions } from "@/core/config/next-auth.config"
import LandingPage from "@/components/landing/landing-page"
import { IUser } from "@/modules/user/interfaces/user.interface"
import { Navbar } from "@/shared/components/layout/navbar"

interface Props {
  params: Promise<{ locale: string }>
}

export default async function Home({ params }: Props) {
  const [session, { locale }] = await Promise.all([
    getServerSession(authOptions),
    params,
  ])

  return (
    <>
      <Navbar locale={locale} user={session?.user as IUser} />
      <LandingPage locale={locale} />
    </>
  )
}
