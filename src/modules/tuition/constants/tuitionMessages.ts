import { BASE_MESSAGE } from "@/core/constants/baseMessages"
import { createModuleMessages } from "@/core/utils/messages.util"

const MODULE = "tuition"

const VALIDATION = {
  ...BASE_MESSAGE.VALIDATION.CODES,
  INVALID_AMOUNT: "INVALID_AMOUNT",
  INVALID_MONTH: "INVALID_MONTH",
  INVALID_STATUS: "INVALID_STATUS",
} as const

const ERRORS = {
  ...BASE_MESSAGE.ERRORS.CODES,
} as const

const SUCCESS = {
  ...BASE_MESSAGE.SUCCESS.CODES,
} as const

export const TUITION_MESSAGE = createModuleMessages(
  MODULE,
  VALIDATION,
  ERRORS,
  SUCCESS
)

export type TuitionValidationErrorCode = typeof TUITION_MESSAGE.VALIDATION.CODES
export type TuitionErrorCode = typeof TUITION_MESSAGE.ERRORS.CODES
export type TuitionSuccessCode = typeof TUITION_MESSAGE.SUCCESS.CODES
