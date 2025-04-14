"use client"

import { Suspense, useEffect } from "react"
import NProgress from "nprogress"
import { usePathname, useSearchParams } from "next/navigation"

// Import styles
import "nprogress/nprogress.css"

// Customize NProgress
NProgress.configure({
  showSpinner: false,
  trickleSpeed: 100,
  minimum: 0.08,
  easing: "ease",
  speed: 200,
})

function ProgressBarContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    NProgress.start()

    const interval = setInterval(() => {
      NProgress.inc(0.1)
    }, 100)

    const handleLoad = () => {
      clearInterval(interval)
      NProgress.done()
    }

    window.addEventListener("load", handleLoad)

    return () => {
      clearInterval(interval)
      window.removeEventListener("load", handleLoad)
      NProgress.done()
    }
  }, [pathname, searchParams])

  return null
}

export default function ProgressBar() {
  return (
    <Suspense fallback={null}>
      <ProgressBarContent />
    </Suspense>
  )
}
