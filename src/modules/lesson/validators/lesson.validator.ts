import { IErrorResponse } from "@/core/types/api/response.interface"
import { ILesson } from "../interfaces/lesson.interface"
import { ELessonStatus } from "../enums/lesson.enum"
import { LESSON_MESSAGE } from "../constants/lessonMessages"
import { BaseValidator } from "@/core/validators/base.validator"

export type CreateLessonData = Omit<ILesson, "id" | "createdAt" | "updatedAt">

export class LessonValidator extends BaseValidator {
  validateTitle(title: string): boolean {
    return (
      this.validateMinLength(title, 2) && this.validateMaxLength(title, 100)
    )
  }

  validateDescription(description: string): boolean {
    return this.validateMaxLength(description, 1000)
  }

  validateCreateData(data: CreateLessonData): IErrorResponse | null {
    // Check required fields
    const requiredFields = ["title", "startTime", "endTime", "classId"]
    const requiredError = this.validateRequiredFields(
      data,
      requiredFields,
      LESSON_MESSAGE.VALIDATION.CODES.MISSING_REQUIRED_FIELDS,
      LESSON_MESSAGE.VALIDATION.MESSAGES.MISSING_REQUIRED_FIELDS
    )
    if (requiredError) return requiredError

    // Validate title
    if (!this.validateTitle(data.title)) {
      return this.createErrorResponse(
        LESSON_MESSAGE.VALIDATION.CODES.INVALID_TITLE,
        LESSON_MESSAGE.VALIDATION.MESSAGES.INVALID_TITLE
      )
    }

    // Validate description if provided
    if (data.description && !this.validateDescription(data.description)) {
      return this.createErrorResponse(
        LESSON_MESSAGE.VALIDATION.CODES.INVALID_DESCRIPTION,
        LESSON_MESSAGE.VALIDATION.MESSAGES.INVALID_DESCRIPTION
      )
    }

    // Validate time range
    if (!this.validateTimeRange(data.startTime, data.endTime)) {
      return this.createErrorResponse(
        LESSON_MESSAGE.VALIDATION.CODES.INVALID_TIME_RANGE,
        LESSON_MESSAGE.VALIDATION.MESSAGES.INVALID_TIME_RANGE
      )
    }

    // Validate status if provided
    if (data.status && !this.validateEnumValue(data.status, ELessonStatus)) {
      return this.createErrorResponse(
        LESSON_MESSAGE.VALIDATION.CODES.INVALID_STATUS,
        LESSON_MESSAGE.VALIDATION.MESSAGES.INVALID_STATUS
      )
    }

    return null
  }

  validateUpdateData(data: Partial<CreateLessonData>): IErrorResponse | null {
    if (data.title && !this.validateTitle(data.title)) {
      return this.createErrorResponse(
        LESSON_MESSAGE.VALIDATION.CODES.INVALID_TITLE,
        LESSON_MESSAGE.VALIDATION.MESSAGES.INVALID_TITLE
      )
    }

    if (data.description && !this.validateDescription(data.description)) {
      return this.createErrorResponse(
        LESSON_MESSAGE.VALIDATION.CODES.INVALID_DESCRIPTION,
        LESSON_MESSAGE.VALIDATION.MESSAGES.INVALID_DESCRIPTION
      )
    }

    if (data.startTime && !this.validateTime(data.startTime)) {
      return this.createErrorResponse(
        LESSON_MESSAGE.VALIDATION.CODES.INVALID_START_TIME,
        LESSON_MESSAGE.VALIDATION.MESSAGES.INVALID_START_TIME
      )
    }

    if (data.endTime && !this.validateTime(data.endTime)) {
      return this.createErrorResponse(
        LESSON_MESSAGE.VALIDATION.CODES.INVALID_END_TIME,
        LESSON_MESSAGE.VALIDATION.MESSAGES.INVALID_END_TIME
      )
    }

    if (
      data.startTime &&
      data.endTime &&
      !this.validateTimeRange(data.startTime, data.endTime)
    ) {
      return this.createErrorResponse(
        LESSON_MESSAGE.VALIDATION.CODES.INVALID_TIME_RANGE,
        LESSON_MESSAGE.VALIDATION.MESSAGES.INVALID_TIME_RANGE
      )
    }

    if (data.status && !this.validateEnumValue(data.status, ELessonStatus)) {
      return this.createErrorResponse(
        LESSON_MESSAGE.VALIDATION.CODES.INVALID_STATUS,
        LESSON_MESSAGE.VALIDATION.MESSAGES.INVALID_STATUS
      )
    }

    return null
  }
}
