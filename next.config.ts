import nextPwa from "next-pwa"
import createNextIntlPlugin from "next-intl/plugin"
import type { NextConfig } from "next"

const withNextIntl = createNextIntlPlugin()

const withPWA = nextPwa({
  dest: "public",
  register: true,
  skipWaiting: true,
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  analyticsId: process.env.NEXT_PUBLIC_ANALYTICS_ID,
  optimizeFonts: true,
  outputFileTracing: true,
}

const config = withPWA(nextConfig) as NextConfig
export default withNextIntl(config)
