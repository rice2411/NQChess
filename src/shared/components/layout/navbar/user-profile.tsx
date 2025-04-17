import { IUser } from "@/modules/user/interfaces/user.interface"
import { Avatar } from "@/shared/components/ui/avatar"
import { useTranslations } from "next-intl"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from "@/shared/components/ui/dropdown-menu"
import { LogOut, Settings, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { AuthService } from "@/modules/auth/services/auth.service"

interface UserProfileProps {
  user: IUser
  locale: string
}

export function UserProfile({ user, locale }: UserProfileProps) {
  const t = useTranslations("common")
  const router = useRouter()

  const handleLogout = async () => {
    // TODO: Implement logout logic
    await AuthService.logout()
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-white/20 rounded-md p-2 transition-colors">
        <Avatar name={user.username} />
        <span className="text-white font-medium hidden sm:inline">
          {user.username}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent
          align="end"
          className="z-[9999] min-w-[220px] bg-black/90 backdrop-blur-md rounded-md p-1 shadow-lg border border-white/10"
        >
          <DropdownMenuLabel className="px-2 py-1.5 text-sm font-medium text-gray-400">
            {t("user.profile")}
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="h-px bg-white/10 my-1" />
          <DropdownMenuItem
            className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md cursor-pointer text-gray-200 hover:bg-white/10 hover:text-white"
            onClick={() => router.push(`/${locale}/profile`)}
          >
            <User className="h-4 w-4" />
            <span>{t("user.viewProfile")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md cursor-pointer text-gray-200 hover:bg-white/10 hover:text-white"
            onClick={() => router.push(`/${locale}/settings`)}
          >
            <Settings className="h-4 w-4" />
            <span>{t("user.settings")}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="h-px bg-white/10 my-1" />
          <DropdownMenuItem
            className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md cursor-pointer text-red-400 hover:bg-red-500/10 hover:text-red-400"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>{t("user.logout")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  )
}
