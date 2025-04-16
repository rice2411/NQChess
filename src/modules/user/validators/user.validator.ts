import { USER_MESSAGE } from "../constants/userMessages"
import { IErrorResponse } from "@/core/types/api/response.interface"
import { IUser } from "../interfaces/user.interface"
import { EUserRole } from "../enums/user.enum"
import { BaseValidator } from "@/core/validators/base.validator"

export type CreateUserData = Omit<IUser, "id" | "createdAt" | "updatedAt">

export class UserValidator extends BaseValidator {
  validateUsername(username: string): boolean {
    return this.stringValidator.validateUsername(username)
  }

  validatePassword(password: string): boolean {
    // Password phải có ít nhất 8 ký tự, 1 chữ hoa, 1 chữ thường, 1 số
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
    return passwordRegex.test(password)
  }

  validateEmail(email: string): boolean {
    return this.stringValidator.validateEmail(email)
  }

  validateRole(role: string): boolean {
    return Object.values(EUserRole).includes(role as EUserRole)
  }

  validateCreateData(data: CreateUserData): IErrorResponse | null {
    // Check required fields
    const requiredFields = ["username", "email", "password", "role"]
    const requiredError = this.validateRequiredFields(
      data,
      requiredFields,
      USER_MESSAGE.VALIDATION.CODES.MISSING_REQUIRED_FIELDS,
      USER_MESSAGE.VALIDATION.MESSAGES.MISSING_REQUIRED_FIELDS
    )
    if (requiredError) return requiredError

    // Validate username
    if (!this.validateUsername(data.username)) {
      return this.createErrorResponse(
        USER_MESSAGE.VALIDATION.CODES.INVALID_USERNAME,
        USER_MESSAGE.VALIDATION.MESSAGES.INVALID_USERNAME
      )
    }

    // Validate email
    if (!this.validateEmail(data.email)) {
      return this.createErrorResponse(
        USER_MESSAGE.VALIDATION.CODES.INVALID_EMAIL,
        USER_MESSAGE.VALIDATION.MESSAGES.INVALID_EMAIL
      )
    }

    // Validate password
    if (!this.validatePassword(data.password)) {
      return this.createErrorResponse(
        USER_MESSAGE.VALIDATION.CODES.INVALID_PASSWORD,
        USER_MESSAGE.VALIDATION.MESSAGES.INVALID_PASSWORD
      )
    }

    // Validate role
    if (!this.validateEnumValue(data.role, EUserRole)) {
      return this.createErrorResponse(
        USER_MESSAGE.VALIDATION.CODES.INVALID_ROLE,
        USER_MESSAGE.VALIDATION.MESSAGES.INVALID_ROLE
      )
    }

    return null
  }

  validateUpdateData(data: Partial<CreateUserData>): IErrorResponse | null {
    if (data.username && !this.validateUsername(data.username)) {
      return this.createErrorResponse(
        USER_MESSAGE.VALIDATION.CODES.INVALID_USERNAME,
        USER_MESSAGE.VALIDATION.MESSAGES.INVALID_USERNAME
      )
    }

    if (data.password && !this.validatePassword(data.password)) {
      return this.createErrorResponse(
        USER_MESSAGE.VALIDATION.CODES.INVALID_PASSWORD,
        USER_MESSAGE.VALIDATION.MESSAGES.INVALID_PASSWORD
      )
    }

    if (data.email && !this.validateEmail(data.email)) {
      return this.createErrorResponse(
        USER_MESSAGE.VALIDATION.CODES.INVALID_EMAIL,
        USER_MESSAGE.VALIDATION.MESSAGES.INVALID_EMAIL
      )
    }

    if (data.role && !this.validateEnumValue(data.role, EUserRole)) {
      return this.createErrorResponse(
        USER_MESSAGE.VALIDATION.CODES.INVALID_ROLE,
        USER_MESSAGE.VALIDATION.MESSAGES.INVALID_ROLE
      )
    }

    return null
  }
}
