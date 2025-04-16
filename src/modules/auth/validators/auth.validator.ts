import { AUTH_MESSAGE } from "../constants/authMessages"
import { IErrorResponse } from "@/core/types/api/response.interface"
import { BaseValidator } from "@/core/validators/base.validator"

export interface ILoginCredentials {
  username: string
  password: string
}

export class AuthValidator extends BaseValidator {
  validateLoginCredentials(data: ILoginCredentials): IErrorResponse | null {
    // Check required fields
    const requiredFields = ["username", "password"]
    const requiredError = this.validateRequiredFields(
      data,
      requiredFields,
      AUTH_MESSAGE.VALIDATION.CODES.MISSING_REQUIRED_FIELDS,
      AUTH_MESSAGE.VALIDATION.MESSAGES.MISSING_REQUIRED_FIELDS
    )
    if (requiredError) return requiredError

    if (!this.stringValidator.validateUsername(data.username)) {
      return this.createErrorResponse(
        AUTH_MESSAGE.VALIDATION.CODES.INVALID_USERNAME,
        AUTH_MESSAGE.VALIDATION.MESSAGES.INVALID_USERNAME
      )
    }

    if (!this.stringValidator.validatePassword(data.password)) {
      return this.createErrorResponse(
        AUTH_MESSAGE.VALIDATION.CODES.INVALID_PASSWORD,
        AUTH_MESSAGE.VALIDATION.MESSAGES.INVALID_PASSWORD
      )
    }

    return null
  }

  handleFirebaseError(error: any): IErrorResponse {
    switch (error.code) {
      case "auth/user-not-found":
        return this.createErrorResponse(
          AUTH_MESSAGE.ERRORS.CODES.NOT_FOUND,
          AUTH_MESSAGE.ERRORS.MESSAGES.NOT_FOUND
        )
      case "auth/wrong-password":
        return this.createErrorResponse(
          AUTH_MESSAGE.VALIDATION.CODES.INVALID_CREDENTIALS,
          AUTH_MESSAGE.VALIDATION.MESSAGES.INVALID_CREDENTIALS
        )
      case "auth/unauthorized":
        return this.createErrorResponse(
          AUTH_MESSAGE.ERRORS.CODES.UNAUTHORIZED,
          AUTH_MESSAGE.ERRORS.MESSAGES.UNAUTHORIZED
        )
      default:
        return this.createErrorResponse(
          AUTH_MESSAGE.ERRORS.CODES.UNKNOWN_ERROR,
          AUTH_MESSAGE.ERRORS.MESSAGES.UNKNOWN_ERROR
        )
    }
  }
}
