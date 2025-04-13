import type { Metadata } from "next"
import { Kings } from "next/font/google"
import "./globals.css"
import QueryProvider from "@/providers/QueryProvider"
import Providers from "@/providers/SessionProvider"

const kings = Kings({
  weight: "400",
  subsets: ["latin", "vietnamese"],
  variable: "--font-kings",
  display: "swap",
})

export const metadata: Metadata = {
  title: "NQChess",
  description: "Như Quỳnh Chess",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <link rel="manifest" href="/manifest.json" />
      <body className={`${kings.variable} antialiased`}>
        <Providers>
          <QueryProvider>{children}</QueryProvider>
        </Providers>
      </body>
    </html>
  )
}
