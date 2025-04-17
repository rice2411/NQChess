"use client"

import { useState } from "react"
import { IUser } from "@/modules/user/interfaces/user.interface"
import { Logo } from "./logo"
import { DesktopMenu } from "./desktop-menu"
import { MobileMenu } from "./mobile-menu"
import { LanguageSwitcher } from "./language-switcher"
import { UserProfile } from "./user-profile"
import { MobileMenuButton } from "./mobile-menu-button"

interface NavbarProps {
  locale: string
  user?: IUser
}

export function Navbar({ locale, user }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-black/30 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center">
            <Logo locale={locale} />
            <div className="md:hidden ml-4">
              <MobileMenuButton isOpen={isMenuOpen} onClick={toggleMenu} />
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <DesktopMenu locale={locale} />
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher - Always visible */}
            <LanguageSwitcher locale={locale} />

            {/* User Profile - Always visible if user exists */}
            {user && <UserProfile user={user} locale={locale} />}
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden ${
            isMenuOpen ? "block" : "hidden"
          } transition-all duration-300 ease-in-out`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <MobileMenu locale={locale} isOpen={isMenuOpen} />
          </div>
        </div>
      </div>
    </nav>
  )
}
