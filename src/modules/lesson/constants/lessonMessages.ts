import { BASE_MESSAGE } from "@/core/constants/baseMessages"
import { createModuleMessages } from "@/core/utils/messages.util"

const MODULE = "lesson"

const VALIDATION = {
  ...BASE_MESSAGE.VALIDATION.CODES,
  INVALID_TITLE: "INVALID_TITLE",
  INVALID_DESCRIPTION: "INVALID_DESCRIPTION",
  INVALID_START_TIME: "INVALID_START_TIME",
  INVALID_END_TIME: "INVALID_END_TIME",
  INVALID_TIME_RANGE: "INVALID_TIME_RANGE",
  INVALID_STATUS: "INVALID_STATUS",
} as const

const ERRORS = {
  ...BASE_MESSAGE.ERRORS.CODES,
} as const

const SUCCESS = {
  ...BASE_MESSAGE.SUCCESS.CODES,
} as const

export const LESSON_MESSAGE = createModuleMessages(
  MODULE,
  VALIDATION,
  ERRORS,
  SUCCESS
)

export type LessonValidationErrorCode = typeof LESSON_MESSAGE.VALIDATION.CODES
export type LessonErrorCode = typeof LESSON_MESSAGE.ERRORS.CODES
export type LessonSuccessCode = typeof LESSON_MESSAGE.SUCCESS.CODES
