import { redirect } from "next/navigation"
import { defaultLocale } from "@/core/config/i18n/constant"

export default function RootPage() {
  redirect(`/${defaultLocale}`)
}
