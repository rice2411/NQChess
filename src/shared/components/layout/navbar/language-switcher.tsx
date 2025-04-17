import { Globe } from "lucide-react"
import { SUPPORTED_LOCALES } from "@/core/config/i18n/locales.constants"
import { usePathname, useRouter } from "next/navigation"
import ReactCountryFlag from "react-country-flag"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from "@/shared/components/ui/dropdown-menu"

const LANGUAGE_FLAGS = {
  en: "US",
  vi: "VN",
} as const

interface LanguageSwitcherProps {
  locale: string
}

export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLocaleChange = (newLocale: string) => {
    if (!pathname) return
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`)
    router.push(newPath)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center space-x-2 text-gray-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20 rounded-md p-2 transition-colors">
        <Globe className="h-5 w-5" />
        <span className="text-sm font-medium">
          {SUPPORTED_LOCALES[locale as keyof typeof SUPPORTED_LOCALES]}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent
          align="end"
          className="z-[9999] min-w-[220px] bg-black/90 backdrop-blur-md rounded-md p-1 shadow-lg border border-white/10"
        >
          <DropdownMenuLabel className="px-2 py-1.5 text-sm font-medium text-gray-400">
            Select Language
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="h-px bg-white/10 my-1" />
          {Object.entries(SUPPORTED_LOCALES).map(([code, name]) => (
            <DropdownMenuItem
              key={code}
              onClick={() => handleLocaleChange(code)}
              className={`flex items-center gap-2 px-2 py-1.5 text-sm rounded-md cursor-pointer outline-none ${
                locale === code
                  ? "bg-white/10 text-white"
                  : "text-gray-200 hover:bg-white/10 hover:text-white"
              }`}
            >
              <ReactCountryFlag
                countryCode={
                  LANGUAGE_FLAGS[code as keyof typeof LANGUAGE_FLAGS]
                }
                svg
                style={{
                  width: "1.5em",
                  height: "1.5em",
                }}
              />
              <span>{name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  )
}
