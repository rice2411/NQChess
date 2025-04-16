import { BASE_MESSAGE } from "@/core/constants/baseMessages"
import { createModuleMessages } from "@/core/utils/messages.util"

const MODULE = "user"

const VALIDATION = {
  ...BASE_MESSAGE.VALIDATION.CODES,
  INVALID_USERNAME: "INVALID_USERNAME",
  INVALID_PASSWORD: "INVALID_PASSWORD",
  INVALID_EMAIL: "INVALID_EMAIL",
  INVALID_ROLE: "INVALID_ROLE",
} as const

const ERRORS = {
  ...BASE_MESSAGE.ERRORS.CODES,
} as const

const SUCCESS = {
  ...BASE_MESSAGE.SUCCESS.CODES,
} as const

export const USER_MESSAGE = createModuleMessages(
  MODULE,
  VALIDATION,
  ERRORS,
  SUCCESS
)

export type UserValidationErrorCode = typeof USER_MESSAGE.VALIDATION.CODES
export type UserErrorCode = typeof USER_MESSAGE.ERRORS.CODES
export type UserSuccessCode = typeof USER_MESSAGE.SUCCESS.CODES
