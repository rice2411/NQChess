import { CLASS_MESSAGE } from "../constants/classMessages"
import { IErrorResponse } from "@/core/types/api/response.interface"
import { IClass, IStudentClass } from "../interfaces/class.interface"
import { EClassStatus, EStudentClassStatus } from "../enums/class.enum"
import { BaseValidator } from "@/core/validators/base.validator"
import { validateSchedules } from "../helpers/class.helper"

export type CreateClassData = Omit<IClass, "id" | "createdAt" | "updatedAt">

export class ClassValidator extends BaseValidator {
  validateClassName(name: string): boolean {
    return this.validateMinLength(name, 2) && this.validateMaxLength(name, 50)
  }

  validateDateRange(startDate: string, endDate: string): boolean {
    return this.dateValidator.validateDateRange(startDate, endDate)
  }

  validateSchedules(schedules: string[]): boolean {
    return (
      this.validateArrayOfStrings(schedules) &&
      schedules.length > 0 &&
      validateSchedules(schedules)
    )
  }

  validateTuition(tuition: number): boolean {
    return this.validatePositiveNumber(tuition)
  }

  validateStudentClass(student: IStudentClass): boolean {
    return (
      this.validateMinLength(student.studentId, 1) &&
      student.joinDate instanceof Date &&
      this.validateEnumValue(student.status, EStudentClassStatus)
    )
  }

  validateCreateData(data: CreateClassData): IErrorResponse | null {
    // Check required fields
    const requiredFields = ["name", "startDate", "endDate", "schedules"]
    const requiredError = this.validateRequiredFields(
      data,
      requiredFields,
      CLASS_MESSAGE.VALIDATION.CODES.MISSING_REQUIRED_FIELDS,
      CLASS_MESSAGE.VALIDATION.MESSAGES.MISSING_REQUIRED_FIELDS
    )
    if (requiredError) return requiredError

    // Validate class name
    if (!this.validateClassName(data.name)) {
      return this.createErrorResponse(
        CLASS_MESSAGE.VALIDATION.CODES.INVALID_NAME,
        CLASS_MESSAGE.VALIDATION.MESSAGES.INVALID_NAME
      )
    }

    // Validate dates
    if (!this.validateDateRange(data.startDate, data.endDate)) {
      return this.createErrorResponse(
        CLASS_MESSAGE.VALIDATION.CODES.INVALID_START_DATE,
        CLASS_MESSAGE.VALIDATION.MESSAGES.INVALID_START_DATE
      )
    }

    // Validate schedules
    if (!this.validateSchedules(data.schedules)) {
      return this.createErrorResponse(
        CLASS_MESSAGE.VALIDATION.CODES.INVALID_SCHEDULES,
        CLASS_MESSAGE.VALIDATION.MESSAGES.INVALID_SCHEDULES
      )
    }

    // Validate status if provided
    if (data.status && !this.validateEnumValue(data.status, EClassStatus)) {
      return this.createErrorResponse(
        CLASS_MESSAGE.VALIDATION.CODES.INVALID_STATUS,
        CLASS_MESSAGE.VALIDATION.MESSAGES.INVALID_STATUS
      )
    }

    // Validate tuition if provided
    if (data.tuition && !this.validateTuition(data.tuition)) {
      return this.createErrorResponse(
        CLASS_MESSAGE.VALIDATION.CODES.INVALID_TUITION,
        CLASS_MESSAGE.VALIDATION.MESSAGES.INVALID_TUITION
      )
    }

    // Validate students if provided
    if (
      data.students &&
      !data.students.every(this.validateStudentClass.bind(this))
    ) {
      return this.createErrorResponse(
        CLASS_MESSAGE.VALIDATION.CODES.INVALID_STUDENT_DATA,
        CLASS_MESSAGE.VALIDATION.MESSAGES.INVALID_STUDENT_DATA
      )
    }

    return null
  }

  validateUpdateData(data: Partial<CreateClassData>): IErrorResponse | null {
    if (data.name && !this.validateClassName(data.name)) {
      return this.createErrorResponse(
        CLASS_MESSAGE.VALIDATION.CODES.INVALID_NAME,
        CLASS_MESSAGE.VALIDATION.MESSAGES.INVALID_NAME
      )
    }

    if (
      data.startDate &&
      data.endDate &&
      !this.validateDateRange(data.startDate, data.endDate)
    ) {
      return this.createErrorResponse(
        CLASS_MESSAGE.VALIDATION.CODES.INVALID_START_DATE,
        CLASS_MESSAGE.VALIDATION.MESSAGES.INVALID_START_DATE
      )
    }

    if (data.schedules && !this.validateSchedules(data.schedules)) {
      return this.createErrorResponse(
        CLASS_MESSAGE.VALIDATION.CODES.INVALID_SCHEDULES,
        CLASS_MESSAGE.VALIDATION.MESSAGES.INVALID_SCHEDULES
      )
    }

    if (data.status && !this.validateEnumValue(data.status, EClassStatus)) {
      return this.createErrorResponse(
        CLASS_MESSAGE.VALIDATION.CODES.INVALID_STATUS,
        CLASS_MESSAGE.VALIDATION.MESSAGES.INVALID_STATUS
      )
    }

    if (data.tuition && !this.validateTuition(data.tuition)) {
      return this.createErrorResponse(
        CLASS_MESSAGE.VALIDATION.CODES.INVALID_TUITION,
        CLASS_MESSAGE.VALIDATION.MESSAGES.INVALID_TUITION
      )
    }

    if (
      data.students &&
      !data.students.every(this.validateStudentClass.bind(this))
    ) {
      return this.createErrorResponse(
        CLASS_MESSAGE.VALIDATION.CODES.INVALID_STUDENT_DATA,
        CLASS_MESSAGE.VALIDATION.MESSAGES.INVALID_STUDENT_DATA
      )
    }

    return null
  }

  validateAddStudents(studentIds: string[]): IErrorResponse | null {
    if (!this.validateArrayOfStrings(studentIds)) {
      return this.createErrorResponse(
        CLASS_MESSAGE.VALIDATION.CODES.INVALID_STUDENT_DATA,
        CLASS_MESSAGE.VALIDATION.MESSAGES.INVALID_STUDENT_DATA
      )
    }

    return null
  }
}
