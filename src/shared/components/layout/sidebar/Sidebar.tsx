import { LayoutDashboard, List, Package, Settings, User } from "lucide-react"
import Image from "next/image"
import React from "react"

const menuItems = [
  {
    icon: <LayoutDashboard />,
    label: "Dashboard",
    active: true,
  },
  {
    icon: <Package />,
    label: "Order",
  },
  {
    icon: <List />,
    label: "Listing",
  },
  {
    icon: <User />,
    label: "Admin",
  },
  {
    icon: <Settings />,
    label: "Setting",
  },
]

export default function Sidebar() {
  return (
    <aside className="h-screen w-[260px] bg-gradient-to-b from-purple-500 to-pink-500 text-white flex flex-col justify-between py-5 px-6">
      {/* Top */}
      <div>
        <div className="flex items-center gap-3 mb-10">
          <span className="font-extrabold text-[22px]">Như Quỳnh Chess</span>
        </div>
        {/* Menu */}
        <nav className="flex flex-col gap-2">
          {menuItems.map((item, idx) => (
            <div
              key={item.label}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                item.active ? "bg-purple-400" : "hover:bg-pink-400"
              }`}
            >
              {item.icon}
              <span className="text-[16px]">{item.label}</span>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  )
}
