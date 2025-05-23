'use client'

import { redirect } from "next/navigation"
import { defaultLocale } from "@/core/config/i18n/constant"
import { usePathname } from "next/navigation"
import { setLocale } from "@/core/utils/locale.util"
import { useEffect } from "react"

export default function RootPage() {
  const pathname = usePathname()
  const locale = pathname.split("/")[1]
  
 useEffect(() => {
  setLocale(locale)
 }, [locale])
  return pathname
}
