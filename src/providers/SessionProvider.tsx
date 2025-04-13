"use client"

import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

export default function AuthProvider({ children }: Props) {
  return (
    <SessionProvider
      basePath="/next-auth"
      refetchOnWindowFocus={false}
      refetchInterval={0}
      refetchWhenOffline={false}
    >
      {children}
    </SessionProvider>
  )
}
