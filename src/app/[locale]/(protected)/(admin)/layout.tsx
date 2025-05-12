import { redirect } from "next/navigation"
import { getCurrentUser } from "@/core/config/next-auth.config"
import Sidebar from "@/shared/components/layout/sidebar/Sidebar"

interface Props {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function AdminLayout({ children, params }: Props) {
  const currentUser = await getCurrentUser()
  const { locale } = await params

  if (!currentUser) {
    redirect(`/${locale}/login`)
  }

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10 flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <main className="pt-16 flex-1 bg-[#f0f4f4]">{children}</main>
        </div>
      </div>
    </div>
  )
}
