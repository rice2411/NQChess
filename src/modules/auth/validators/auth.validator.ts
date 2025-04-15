import { AUTH_MESSAGES } from "./auth.messages"
import { IErrorResponse } from "@/core/types/api/response.interface"

export interface ILoginCredentials {
  username: string
  password: string
}

export class AuthValidator {
  validateLoginCredentials(
    credentials: ILoginCredentials
  ): IErrorResponse | null {
    if (!credentials.username || !credentials.password) {
      return {
        success: false,
        errorCode: "INVALID_CREDENTIALS",
        message: AUTH_MESSAGES.INVALID_CREDENTIALS,
      }
    }
    return null
  }

  handleFirebaseError(error: any): IErrorResponse {
    if (!error.code) {
      return {
        success: false,
        errorCode: "UNKNOWN_ERROR",
        message: AUTH_MESSAGES.UNAUTHORIZED,
      }
    }

    switch (error.code) {
      case "auth/invalid-credential":
        return {
          success: false,
          errorCode: "WRONG_PASSWORD",
          message: AUTH_MESSAGES.INVALID_CREDENTIALS,
        }
      case "auth/user-not-found":
        return {
          success: false,
          errorCode: "USER_NOT_FOUND",
          message: AUTH_MESSAGES.USER_NOT_FOUND,
        }
      default:
        return {
          success: false,
          errorCode: "FIREBASE_ERROR",
          message: AUTH_MESSAGES.UNAUTHORIZED,
        }
    }
  }
}
