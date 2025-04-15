import { signInWithEmailAndPassword, signOut } from "firebase/auth"
import {
  IErrorResponse,
  ISuccessResponse,
} from "@/core/types/api/response.interface"
import { auth } from "@/core/config/firebase/client.config"
import { signIn, signOut as signOutNextAuth } from "next-auth/react"
import { IUser } from "@/modules/user/interfaces/user.interface"
import { UserService } from "@/modules/user/services/user.service"
import { AuthValidator } from "../validators/auth.validator"
import { AUTH_MESSAGES } from "../validators/auth.messages"
import { ILoginCredentials } from "../types/login.interface"

const authValidator = new AuthValidator()

export const AuthService = {
  async login(
    credentials: ILoginCredentials
  ): Promise<ISuccessResponse<IUser> | IErrorResponse> {
    try {
      // Validate credentials
      const validationError =
        authValidator.validateLoginCredentials(credentials)
      if (validationError) {
        return validationError
      }

      // Run Firebase auth and get user data in parallel
      const [userCredential, user] = await Promise.all([
        signInWithEmailAndPassword(
          auth,
          credentials.username + "@nqchess.com",
          credentials.password
        ),
        UserService.getByUsername(credentials.username),
      ])

      if (!user.success) {
        return {
          success: false,
          errorCode: "USER_NOT_FOUND",
          message: AUTH_MESSAGES.USER_NOT_FOUND,
        }
      }

      await signIn("credentials", {
        ...user.data,
        redirect: false,
      })

      return {
        success: true,
        message: AUTH_MESSAGES.LOGIN_SUCCESS,
        data: user.data as IUser,
      }
    } catch (error) {
      return authValidator.handleFirebaseError(error)
    }
  },

  async logout(): Promise<ISuccessResponse<null> | IErrorResponse> {
    try {
      await signOut(auth)
      await signOutNextAuth({ redirect: false })
      return {
        success: true,
        message: AUTH_MESSAGES.LOGOUT_SUCCESS,
        data: null,
      }
    } catch (error) {
      console.error("Logout error:", error)
      return authValidator.handleFirebaseError(error)
    }
  },
}
