import { BASE_MESSAGE } from "@/core/constants/baseMessages"
import { createModuleMessages } from "@/core/utils/messages.util"

const MODULE = "attendance"

const VALIDATION = {
  ...BASE_MESSAGE.VALIDATION.CODES,
  INVALID_STATUS: "INVALID_STATUS",
} as const

const ERRORS = {
  ...BASE_MESSAGE.ERRORS.CODES,
} as const

const SUCCESS = {
  ...BASE_MESSAGE.SUCCESS.CODES,
} as const

export const ATTENDANCE_MESSAGE = createModuleMessages(
  MODULE,
  VALIDATION,
  ERRORS,
  SUCCESS
)

export type AttendanceValidationErrorCode =
  typeof ATTENDANCE_MESSAGE.VALIDATION.CODES
export type AttendanceErrorCode = typeof ATTENDANCE_MESSAGE.ERRORS.CODES
export type AttendanceSuccessCode = typeof ATTENDANCE_MESSAGE.SUCCESS.CODES
