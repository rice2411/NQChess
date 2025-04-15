import { ATTENDANCE_MESSAGES } from "./attendance.messages"
import { IErrorResponse } from "@/core/types/api/response.interface"
import { IAttendance } from "../interfaces/attendance.interface"
import { EAttendanceStatus } from "../enum/attendance.enum"

export type CreateAttendanceData = Omit<
  IAttendance,
  "id" | "createdAt" | "updatedAt"
>

export class AttendanceValidator {
  validateStatus(status: string): boolean {
    return Object.values(EAttendanceStatus).includes(
      status as EAttendanceStatus
    )
  }

  validateCreateData(data: CreateAttendanceData): IErrorResponse | null {
    if (!data.studentId || !data.lessonId || !data.status) {
      return {
        success: false,
        errorCode: "MISSING_REQUIRED_FIELDS",
        message: ATTENDANCE_MESSAGES.MISSING_REQUIRED_FIELDS,
      }
    }

    if (!this.validateStatus(data.status)) {
      return {
        success: false,
        errorCode: "INVALID_STATUS",
        message: ATTENDANCE_MESSAGES.INVALID_STATUS,
      }
    }

    return null
  }

  validateUpdateData(
    data: Partial<CreateAttendanceData>
  ): IErrorResponse | null {
    if (data.status && !this.validateStatus(data.status)) {
      return {
        success: false,
        errorCode: "INVALID_STATUS",
        message: ATTENDANCE_MESSAGES.INVALID_STATUS,
      }
    }

    return null
  }
}
