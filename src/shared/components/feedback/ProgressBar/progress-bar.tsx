"use client"

import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import NProgress from "nprogress"
import "nprogress/nprogress.css"

export default function ProgressBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    NProgress.configure({
      showSpinner: false,
      minimum: 0.1,
      trickleSpeed: 200,
    })

    NProgress.start()

    const timer = setTimeout(() => {
      NProgress.done()
    }, 100)

    const handleBeforeUnload = () => {
      NProgress.done()
    }

    const handleLoad = () => {
      NProgress.done()
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    window.addEventListener("load", handleLoad)

    return () => {
      clearTimeout(timer)
      NProgress.done()
      window.removeEventListener("beforeunload", handleBeforeUnload)
      window.removeEventListener("load", handleLoad)
    }
  }, [pathname, searchParams, mounted])

  return null
}
