import { EUserRole } from "@/modules/user/enums/user.enum"
import { IUser } from "@/modules/user/interfaces/user.interface"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Thêm type cho session và user
declare module "next-auth" {
  interface Session {
    user: IUser
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(user) {
        const data = { ...user } as IUser
        try {
          if (!data || !data.id || !data.username) {
            return null
          }
          return data as IUser
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const data = user as IUser
      if (data) {
        token.id = data.id
        token.email = data.email as string
        token.dataname = data.username
        token.role = data.role
        token.createdAt = data.createdAt as string
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.username = token.username as string
        session.user.role = token.role as EUserRole
        session.user.createdAt = token.createdAt as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV !== "production",
}
