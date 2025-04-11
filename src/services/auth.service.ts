import { IUser } from "@/types/domain/user.interface"
import { signInWithEmailAndPassword, signOut } from "firebase/auth"
import {
  IErrorResponse,
  ISuccessResponse,
} from "@/types/api/response.interface"
import { tokenUtils } from "@/utils/token"
import { auth } from "@/config/firebase/client.config"
import { UserService } from "./user.service"

export interface LoginCredentials {
  username: string
  password: string
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
      const token = await userCredential.user.getIdToken()
      tokenUtils.setToken(token)
      // 4. Find user by username
      const user = await UserService.getUserByUsername(credentials.username)
      if (!user.success) return user as IErrorResponse
      return {
        success: true,
        message: "Login successful",
        data: user.data as IUser,
      }
    } catch (error) {
      console.error("Login error:", error)
      return {
        success: false,
        errorCode: "LOGIN_ERROR",
        message: "Invalid username or password",
      }
    }
  },

  async logout(): Promise<ISuccessResponse<null> | IErrorResponse> {
    try {
      await signOut(auth)
      tokenUtils.removeToken()
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
