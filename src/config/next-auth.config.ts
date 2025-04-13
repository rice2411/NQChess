import { NextAuthOptions } from "next-auth"
import { FirestoreAdapter } from "@auth/firebase-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import { IUser } from "@/types/domain/user.interface"
import { EUserRole } from "@/enum/user.enum"
import admin from "./firebase/admin.config"
import { serviceAccount } from "./firebase/admin.config"

// Thêm type cho session và user
declare module "next-auth" {
  interface Session {
    user: IUser
  }
}

const firebaseConfig = {
  credential: admin.credential.cert(JSON.parse(JSON.stringify(serviceAccount))),
}

export const authOptions: NextAuthOptions = {
  adapter: FirestoreAdapter(firebaseConfig) as any,
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
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV !== "production",
}
