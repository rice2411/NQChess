"use client"

import {
  ClipboardCheck,
  School,
  User,
  Users,
  Wallet,
  Menu,
  Settings,
  LogOut,
} from "lucide-react"
import React, { useState } from "react"
import { Button } from "@/core/components/ui/button"
import { useTranslations } from "next-intl"
import { usePathname } from "next/navigation"

export default function SidebarAdmin() {
  const [open, setOpen] = useState(false)
  const t = useTranslations("admin.sidebar")
  const pathname = usePathname().split("/")[2]
  const systemItems = [
    { icon: <Users />, key: "students" },
    {
      icon: <ClipboardCheck />,
      key: "attendances",
    },
    { icon: <School />, key: "classes" },
    { icon: <Wallet />, key: "tuitions" },
    { icon: <User />, key: "users" },
  ]
  const settingItems = [
    { icon: <Settings />, key: "settings" },
    { icon: <LogOut />, key: "logout" },
  ]
  return (
    <>
      {/* Nút toggle cho mobile */}
      <Button
        variant="secondary"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setOpen(true)}
        aria-label="Mở menu"
      >
        <Menu className="h-6 w-6 text-purple-700" />
      </Button>
      {/* Overlay khi mở sidebar trên mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-[260px] bg-gradient-to-b from-purple-300 to-pink-300 text-purple-900 flex-col justify-between py-5 px-6
          transition-transform duration-300
          ${open ? "translate-x-0 flex" : "-translate-x-full"}
          md:static md:translate-x-0 md:shadow-none md:flex
        `}
        style={{ minHeight: "100vh" }}
      >
        {/* Top */}
        <div>
          <div className="flex items-center gap-3 mb-10">
            <span className="font-extrabold text-[22px]">{t("title")}</span>
          </div>
          <span className="text-sm font-medium ">{t("subtitle")}</span>
          {/* Menu */}
          <nav className="flex flex-col gap-2 mt-2">
            {systemItems.map((item) => (
              <li
                key={item.key}
                className={`sidebar-item group cursor-pointer flex items-center gap-3 px-4 py-2 rounded-lg transition hover:bg-purple-100 ${
                  pathname.startsWith(item.key)
                    ? "bg-white/80 text-purple-700 font-bold"
                    : ""
                }`}
              >
                <span className="icon">{item.icon}</span>
                <span className="label group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-b group-hover:from-purple-500 group-hover:to-pink-500 transition">
                  {t(item.key)}
                </span>
              </li>
            ))}
          </nav>
          <span className="text-sm font-medium ">{t("subtitle2")}</span>
          {/* Menu */}
          <nav className="flex flex-col gap-2 mt-2">
            {settingItems.map((item) => (
              <li
                key={item.key}
                className={`sidebar-item group cursor-pointer flex items-center gap-3 px-4 py-2 rounded-lg transition hover:bg-purple-100 ${
                  pathname.startsWith(item.key)
                    ? "bg-white/80 text-purple-700 font-bold"
                    : ""
                }`}
              >
                <span className="icon">{item.icon}</span>
                <span className="label group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-b group-hover:from-purple-500 group-hover:to-pink-500 transition">
                  {t(item.key)}
                </span>
              </li>
            ))}
          </nav>
        </div>
      </aside>
    </>
  )
}
