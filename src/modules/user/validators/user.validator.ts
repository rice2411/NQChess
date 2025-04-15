import { USER_MESSAGES } from "./user.messages"
import { IErrorResponse } from "@/core/types/api/response.interface"
import { IUser } from "../interfaces/user.interface"
import { EUserRole } from "../enums/user.enum"

export type CreateUserData = Omit<IUser, "id" | "createdAt" | "updatedAt">

export class UserValidator {
  validateUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
    return usernameRegex.test(username)
  }

  validatePassword(password: string): boolean {
    // Password phải có ít nhất 8 ký tự, 1 chữ hoa, 1 chữ thường, 1 số
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
    return passwordRegex.test(password)
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  validateRole(role: string): boolean {
    return Object.values(EUserRole).includes(role as EUserRole)
  }

  validateCreateData(data: CreateUserData): IErrorResponse | null {
    if (!data.username || !data.password || !data.email || !data.role) {
      return {
        success: false,
        errorCode: "MISSING_REQUIRED_FIELDS",
        message: USER_MESSAGES.MISSING_REQUIRED_FIELDS,
      }
    }

    if (!this.validateUsername(data.username)) {
      return {
        success: false,
        errorCode: "INVALID_USERNAME",
        message: USER_MESSAGES.INVALID_USERNAME,
      }
    }

    if (!this.validatePassword(data.password)) {
      return {
        success: false,
        errorCode: "INVALID_PASSWORD",
        message: USER_MESSAGES.INVALID_PASSWORD,
      }
    }

    if (!this.validateEmail(data.email)) {
      return {
        success: false,
        errorCode: "INVALID_EMAIL",
        message: USER_MESSAGES.INVALID_EMAIL,
      }
    }

    if (!this.validateRole(data.role)) {
      return {
        success: false,
        errorCode: "INVALID_ROLE",
        message: USER_MESSAGES.INVALID_ROLE,
      }
    }

    return null
  }

  validateUpdateData(data: Partial<CreateUserData>): IErrorResponse | null {
    if (data.username && !this.validateUsername(data.username)) {
      return {
        success: false,
        errorCode: "INVALID_USERNAME",
        message: USER_MESSAGES.INVALID_USERNAME,
      }
    }

    if (data.password && !this.validatePassword(data.password)) {
      return {
        success: false,
        errorCode: "INVALID_PASSWORD",
        message: USER_MESSAGES.INVALID_PASSWORD,
      }
    }

    if (data.email && !this.validateEmail(data.email)) {
      return {
        success: false,
        errorCode: "INVALID_EMAIL",
        message: USER_MESSAGES.INVALID_EMAIL,
      }
    }

    if (data.role && !this.validateRole(data.role)) {
      return {
        success: false,
        errorCode: "INVALID_ROLE",
        message: USER_MESSAGES.INVALID_ROLE,
      }
    }

    return null
  }
}
