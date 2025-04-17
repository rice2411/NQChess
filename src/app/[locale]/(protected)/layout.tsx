import { redirect } from "next/navigation"
import Image from "next/image"
import { getCurrentUser } from "@/core/config/next-auth.config"
import { Navbar } from "@/shared/components/layout/navbar"

interface Props {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function ProtectedLayout({ children, params }: Props) {
  const currentUser = await getCurrentUser()
  const { locale } = await params

  if (!currentUser) {
    redirect(`/${locale}/login`)
  }

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
        <div className="min-h-screen flex flex-col">
          <Navbar locale={locale} user={currentUser} />
          <main className="pt-16">{children}</main>
        </div>
      </div>
    </div>
  )
}
