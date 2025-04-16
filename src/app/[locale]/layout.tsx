import { NextIntlClientProvider } from "next-intl"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import QueryProvider from "@/core/providers/QueryProvider"
import Providers from "@/core/providers/SessionProvider"
import { locales, type Locale } from "@/core/config/i18n/constant"
import ProgressBar from "@/shared/components/feedback/ProgressBar/progress-bar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NQChess",
  description: "NQChess - Chess Learning Platform",
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: Locale }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!locales.includes(locale)) {
    notFound()
  }

  let messages
  try {
    messages = (await import(`@/core/config/i18n/messages/${locale}.json`))
      .default
  } catch {
    notFound()
  }

  return (
    <html lang={locale}>
      <link rel="manifest" href="/manifest.json" />
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ProgressBar />
          <Providers>
            <QueryProvider>{children}</QueryProvider>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
