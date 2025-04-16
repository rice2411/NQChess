import { BASE_MESSAGE } from "@/core/constants/baseMessages"
import { createModuleMessages } from "@/core/utils/messages.util"

const MODULE = "auth"

const VALIDATION = {
  ...BASE_MESSAGE.VALIDATION.CODES,
  INVALID_USERNAME: "INVALID_USERNAME",
  INVALID_PASSWORD: "INVALID_PASSWORD",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
} as const

const ERRORS = {
  ...BASE_MESSAGE.ERRORS.CODES,
  UNAUTHORIZED: "UNAUTHORIZED",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
} as const

const SUCCESS = {
  ...BASE_MESSAGE.SUCCESS.CODES,
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGOUT_SUCCESS: "LOGOUT_SUCCESS",
} as const

export const AUTH_MESSAGE = createModuleMessages(
  MODULE,
  VALIDATION,
  ERRORS,
  SUCCESS
)

export type AuthValidationErrorCode = typeof AUTH_MESSAGE.VALIDATION.CODES
export type AuthErrorCode = typeof AUTH_MESSAGE.ERRORS.CODES
export type AuthSuccessCode = typeof AUTH_MESSAGE.SUCCESS.CODES
