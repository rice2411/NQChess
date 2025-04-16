import { IErrorResponse } from "@/core/types/api/response.interface"
import { DateValidator } from "./date.validator"
import { EnumValidator } from "./enum.validator"
import { TimeValidator } from "./time.validator"
import { StringValidator } from "./string.validator"

export class BaseValidator {
  protected dateValidator = new DateValidator()
  protected enumValidator = new EnumValidator()
  protected timeValidator = new TimeValidator()
  protected stringValidator = new StringValidator()

  // String validations
  validateEmail(email: string): boolean {
    return this.stringValidator.validateEmail(email)
  }

  validateUsername(username: string): boolean {
    return this.stringValidator.validateUsername(username)
  }

  validateFullName(name: string): boolean {
    return this.stringValidator.validateFullName(name)
  }

  validateMinLength(value: string | any[], min: number): boolean {
    if (typeof value === "string") {
      return this.stringValidator.validateMinLength(value, min)
    }
    return value.length >= min
  }

  validateMaxLength(value: string | any[], max: number): boolean {
    if (typeof value === "string") {
      return this.stringValidator.validateMaxLength(value, max)
    }
    return value.length <= max
  }

  // Number validations
  validateNumber(value: any): boolean {
    return typeof value === "number" && !isNaN(value)
  }

  validatePositiveNumber(value: number): boolean {
    return this.validateNumber(value) && value > 0
  }

  validateRange(value: number, min: number, max: number): boolean {
    return this.validateNumber(value) && value >= min && value <= max
  }

  // Date validations
  validateDateOfBirth(date: string): boolean {
    return this.dateValidator.validateDateOfBirth(date)
  }

  validateDateRange(startDate: string, endDate: string): boolean {
    return this.dateValidator.validateDateRange(startDate, endDate)
  }

  // Time validations
  validateTime(time: string): boolean {
    return this.timeValidator.validateTime(time)
  }

  validateTimeRange(startTime: string, endTime: string): boolean {
    return this.timeValidator.validateTimeRange(startTime, endTime)
  }

  // Enum validations
  validateEnumValue<T extends Record<string, string>>(
    value: string,
    enumType: T
  ): boolean {
    return this.enumValidator.validateEnumValue(value, enumType)
  }

  // Array validations
  validateArray(value: any): boolean {
    return Array.isArray(value)
  }

  validateArrayOfStrings(arr: string[]): boolean {
    return (
      this.validateArray(arr) && arr.every((item) => typeof item === "string")
    )
  }

  validateArrayOfObjects(arr: any[]): boolean {
    return (
      this.validateArray(arr) && arr.every((item) => this.validateObject(item))
    )
  }

  // Object validations
  validateObject(value: any): boolean {
    return typeof value === "object" && value !== null && !Array.isArray(value)
  }

  // Common error response methods
  createErrorResponse(errorCode: string, message: string): IErrorResponse {
    return {
      success: false,
      errorCode,
      message,
    }
  }

  validateRequiredFields(
    data: Record<string, any>,
    requiredFields: string[],
    errorCode: string,
    errorMessage: string
  ): IErrorResponse | null {
    const missingFields = requiredFields.filter((field) => !data[field])
    if (missingFields.length > 0) {
      return this.createErrorResponse(errorCode, errorMessage)
    }
    return null
  }
}
