import NextAuth from "next-auth"
import { authOptions } from "@/core/config/next-auth.config"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
