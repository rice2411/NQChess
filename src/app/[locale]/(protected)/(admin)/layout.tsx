import { redirect } from "next/navigation"
import { getCurrentUser } from "@/core/config/next-auth.config"
import Sidebar from "@/core/components/layout/admin/sidebar/Sidebar"

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
    <div className="relative min-h-screen h-screen overflow-x-hidden">
      <div className="relative z-10 flex min-h-screen h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen h-screen w-full">
          <main className="flex-1 bg-[#f0f4f4] overflow-y-auto h-screen w-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
