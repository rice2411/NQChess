import { BASE_MESSAGE } from "@/core/constants/baseMessages"
import { createModuleMessages } from "@/core/utils/messages.util"

const MODULE = "student"

const VALIDATION = {
  ...BASE_MESSAGE.VALIDATION.CODES,
  INVALID_NAME: "INVALID_NAME",
  INVALID_PHONE: "INVALID_PHONE",
  INVALID_DOB: "INVALID_DOB",
  INVALID_GENDER: "INVALID_GENDER",
  INVALID_CLASSES: "INVALID_CLASSES",
  INVALID_AVATAR: "INVALID_AVATAR",
} as const

const ERRORS = {
  ...BASE_MESSAGE.ERRORS.CODES,
} as const

const SUCCESS = {
  ...BASE_MESSAGE.SUCCESS.CODES,
} as const

export const STUDENT_MESSAGE = createModuleMessages(
  MODULE,
  VALIDATION,
  ERRORS,
  SUCCESS
)

export type StudentValidationErrorCode = typeof STUDENT_MESSAGE.VALIDATION.CODES
export type StudentErrorCode = typeof STUDENT_MESSAGE.ERRORS.CODES
export type StudentSuccessCode = typeof STUDENT_MESSAGE.SUCCESS.CODES
