import { IUser } from "@/types/domain/user.interface"
import { signInWithEmailAndPassword, signOut } from "firebase/auth"
import {
  IErrorResponse,
  ISuccessResponse,
} from "@/types/api/response.interface"
import { auth } from "@/config/firebase/client.config"
import { UserService } from "./user.service"
import { signIn, signOut as signOutNextAuth } from "next-auth/react"

export interface LoginCredentials {
  username: string
  password: string
}

const handleFirebaseError = (error: any): IErrorResponse => {
  switch (error.code) {
    case "auth/invalid-email":
      return {
        success: false,
        errorCode: "INVALID_EMAIL",
        message: "Email không hợp lệ",
      }
    case "auth/wrong-password":
      return {
        success: false,
        errorCode: "WRONG_PASSWORD",
        message: "Sai mật khẩu",
      }
    case "auth/user-not-found":
      return {
        success: false,
        errorCode: "USER_NOT_FOUND",
        message: "Người dùng không tồn tại",
      }
    default:
      return {
        success: false,
        errorCode: "FIREBASE_ERROR",
        message: "Lỗi xác thực",
      }
  }
}

export const AuthService = {
  async login(
    credentials: LoginCredentials
  ): Promise<ISuccessResponse<IUser> | IErrorResponse> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.username + "@nqchess.com",
        credentials.password
      )

      const user = await UserService.getUserByUsername(credentials.username)
      if (!user.success) return user as IErrorResponse

      const result = await signIn("credentials", {
        ...user.data,
        token: await userCredential.user.getIdToken(),
        redirect: false,
      })

      if (result?.error) {
        return {
          success: false,
          errorCode: "NEXTAUTH_ERROR",
          message: result.error,
        }
      }

      return {
        success: true,
        message: "Đăng nhập thành công",
        data: user.data as IUser,
      }
    } catch (error) {
      return handleFirebaseError(error)
    }
  },

  async logout(): Promise<ISuccessResponse<null> | IErrorResponse> {
    try {
      await signOut(auth)
      await signOutNextAuth({ redirect: false })
      return {
        success: true,
        message: "Logout successful",
        data: null,
      }
    } catch (error) {
      console.error("Logout error:", error)
      return {
        success: false,
        errorCode: "LOGOUT_ERROR",
        message: "Failed to logout",
      }
    }
  },
}
