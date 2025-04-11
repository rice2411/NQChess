import nextPwa from "next-pwa"

const withPWA = nextPwa({
  dest: "public",
  register: true,
  skipWaiting: true,
})

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config: any) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": require("path").resolve(__dirname, "src"),
    }
    return config
  },
}

export default withPWA(nextConfig)
