import { ATTENDANCE_MESSAGE } from "../constants/attendanceMessages"
import { IErrorResponse } from "@/core/types/api/response.interface"
import { IAttendance } from "../interfaces/attendance.interface"
import { EAttendanceStatus } from "../enum/attendance.enum"
import { BaseValidator } from "@/core/validators/base.validator"

export type CreateAttendanceData = Omit<
  IAttendance,
  "id" | "createdAt" | "updatedAt"
>

export class AttendanceValidator extends BaseValidator {
  validateCreateData(data: CreateAttendanceData): IErrorResponse | null {
    // Check required fields
    const requiredFields = ["studentId", "lessonId", "status"]
    const requiredError = this.validateRequiredFields(
      data,
      requiredFields,
      ATTENDANCE_MESSAGE.VALIDATION.CODES.MISSING_REQUIRED_FIELDS,
      ATTENDANCE_MESSAGE.VALIDATION.MESSAGES.MISSING_REQUIRED_FIELDS
    )
    if (requiredError) return requiredError

    if (!this.enumValidator.validateEnumValue(data.status, EAttendanceStatus)) {
      return this.createErrorResponse(
        ATTENDANCE_MESSAGE.VALIDATION.CODES.INVALID_STATUS,
        ATTENDANCE_MESSAGE.VALIDATION.MESSAGES.INVALID_STATUS
      )
    }

    return null
  }

  validateUpdateData(
    data: Partial<CreateAttendanceData>
  ): IErrorResponse | null {
    if (
      data.status &&
      !this.enumValidator.validateEnumValue(data.status, EAttendanceStatus)
    ) {
      return this.createErrorResponse(
        ATTENDANCE_MESSAGE.VALIDATION.CODES.INVALID_STATUS,
        ATTENDANCE_MESSAGE.VALIDATION.MESSAGES.INVALID_STATUS
      )
    }

    return null
  }
}
