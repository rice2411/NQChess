import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export default async function ProtectedLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const session = await getServerSession()
  if (!session) {
    redirect(`/${locale}/login`)
  }

  return <>{children}</>
}
