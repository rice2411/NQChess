import { IErrorResponse } from "@/core/types/api/response.interface"
import { ITuition } from "../interfaces/tuition.interface"
import { ETuitionStatus } from "../enum/tuition.enum"
import { TUITION_MESSAGE } from "../constants/tuitionMessages"
import { BaseValidator } from "@/core/validators/base.validator"

export type CreateTuitionData = Omit<ITuition, "id" | "createdAt" | "updatedAt">

export class TuitionValidator extends BaseValidator {
  validateAmount(amount: number): boolean {
    return this.validatePositiveNumber(amount)
  }

  validateCreateData(data: CreateTuitionData): IErrorResponse | null {
    // Check required fields
    const requiredFields = ["classId", "studentId", "amount", "month"]
    const requiredError = this.validateRequiredFields(
      data,
      requiredFields,
      TUITION_MESSAGE.VALIDATION.CODES.MISSING_REQUIRED_FIELDS,
      TUITION_MESSAGE.VALIDATION.MESSAGES.MISSING_REQUIRED_FIELDS
    )
    if (requiredError) return requiredError

    if (!this.validateAmount(data.amount)) {
      return this.createErrorResponse(
        TUITION_MESSAGE.VALIDATION.CODES.INVALID_AMOUNT,
        TUITION_MESSAGE.VALIDATION.MESSAGES.INVALID_AMOUNT
      )
    }

    if (!this.dateValidator.validateMonth(data.month)) {
      return this.createErrorResponse(
        TUITION_MESSAGE.VALIDATION.CODES.INVALID_MONTH,
        TUITION_MESSAGE.VALIDATION.MESSAGES.INVALID_MONTH
      )
    }

    if (data.status && !this.validateEnumValue(data.status, ETuitionStatus)) {
      return this.createErrorResponse(
        TUITION_MESSAGE.VALIDATION.CODES.INVALID_STATUS,
        TUITION_MESSAGE.VALIDATION.MESSAGES.INVALID_STATUS
      )
    }

    return null
  }

  validateUpdateData(data: Partial<CreateTuitionData>): IErrorResponse | null {
    if (data.amount && !this.validateAmount(data.amount)) {
      return this.createErrorResponse(
        TUITION_MESSAGE.VALIDATION.CODES.INVALID_AMOUNT,
        TUITION_MESSAGE.VALIDATION.MESSAGES.INVALID_AMOUNT
      )
    }

    if (data.month && !this.dateValidator.validateMonth(data.month)) {
      return this.createErrorResponse(
        TUITION_MESSAGE.VALIDATION.CODES.INVALID_MONTH,
        TUITION_MESSAGE.VALIDATION.MESSAGES.INVALID_MONTH
      )
    }

    if (data.status && !this.validateEnumValue(data.status, ETuitionStatus)) {
      return this.createErrorResponse(
        TUITION_MESSAGE.VALIDATION.CODES.INVALID_STATUS,
        TUITION_MESSAGE.VALIDATION.MESSAGES.INVALID_STATUS
      )
    }

    return null
  }
}
