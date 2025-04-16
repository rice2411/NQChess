import { BASE_MESSAGE } from "@/core/constants/baseMessages"
import { createModuleMessages } from "@/core/utils/messages.util"

const MODULE = "class"

const VALIDATION = {
  ...BASE_MESSAGE.VALIDATION.CODES,
  INVALID_NAME: "INVALID_NAME",
  INVALID_START_DATE: "INVALID_START_DATE",
  INVALID_SCHEDULES: "INVALID_SCHEDULES",
  INVALID_STATUS: "INVALID_STATUS",
  INVALID_TUITION: "INVALID_TUITION",
  INVALID_STUDENT_DATA: "INVALID_STUDENT_DATA",
} as const

const ERRORS = {
  ...BASE_MESSAGE.ERRORS.CODES,
  DUPLICATE_STUDENTS: "DUPLICATE_STUDENTS",
} as const

const SUCCESS = {
  ...BASE_MESSAGE.SUCCESS.CODES,
  ADD_STUDENTS_SUCCESS: "ADD_STUDENTS_SUCCESS",
} as const

export const CLASS_MESSAGE = createModuleMessages(
  MODULE,
  VALIDATION,
  ERRORS,
  SUCCESS
)

export type ClassValidationErrorCode = typeof CLASS_MESSAGE.VALIDATION.CODES
export type ClassErrorCode = typeof CLASS_MESSAGE.ERRORS.CODES
export type ClassSuccessCode = typeof CLASS_MESSAGE.SUCCESS.CODES
