import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "NQChess | API Documentation",
  description: "Như Quỳnh Chess",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
