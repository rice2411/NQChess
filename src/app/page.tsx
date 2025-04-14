import { authOptions } from "@/core/config/next-auth.config"
import { getServerSession } from "next-auth"

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <>
      <h3 className="font-kings text-primary">
        {session?.user
          ? `Xin chào ${session.user.username}`
          : `Như Quỳnh Chess`}
      </h3>
      <a href="/api" className="text-blue-500 hover:text-blue-700 underline">
        Đi tới API Documentation
      </a>
    </>
  )
}
