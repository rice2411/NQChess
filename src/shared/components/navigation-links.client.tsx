"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { IUser } from "@/modules/user/interfaces/user.interface"

interface NavigationLinksProps {
  user: IUser | null
  translations: {
    apiDocument: string
    login: string
  }
}

export default function NavigationLinks({
  user,
  translations,
}: NavigationLinksProps) {
  const pathname = usePathname()
  const currentLocale = pathname.split("/")[1]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Link
        href={`/${currentLocale}/api-document`}
        className="p-6 border rounded-lg hover:bg-gray-100"
      >
        <h2 className="text-2xl font-semibold mb-2">
          {translations.apiDocument}
        </h2>
      </Link>

      {!user && (
        <Link
          href={`/${currentLocale}/login`}
          className="p-6 border rounded-lg hover:bg-gray-100"
        >
          <h2 className="text-2xl font-semibold mb-2">{translations.login}</h2>
        </Link>
      )}
    </div>
  )
}
