import i18n from "@/core/config/i18n"
import { BASE_MESSAGE } from "../constants/baseMessages"

const toCamelCase = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

export const createModuleMessages = <
  V extends Record<string, string>,
  E extends Record<string, string>,
  S extends Record<string, string>
>(
  module: string,
  validation: V,
  errors: E,
  success: S
) => {
  const createMessages = (codes: Record<string, string>, type: string) => {
    return Object.keys(codes).reduce(
      (acc, key) => ({
        ...acc,
        [key]: i18n.t(`${module}.${type}.${toCamelCase(key)}`),
      }),
      {} as Record<string, string>
    )
  }

  return {
    VALIDATION: {
      CODES: {
        ...BASE_MESSAGE.VALIDATION.CODES,
        ...validation,
      },
      MESSAGES: {
        ...createMessages(BASE_MESSAGE.VALIDATION.CODES, "validation"),
        ...createMessages(validation, "validation"),
      },
    },
    ERRORS: {
      CODES: {
        ...BASE_MESSAGE.ERRORS.CODES,
        ...errors,
      },
      MESSAGES: {
        ...createMessages(BASE_MESSAGE.ERRORS.CODES, "errors"),
        ...createMessages(errors, "errors"),
      },
    },
    SUCCESS: {
      CODES: {
        ...BASE_MESSAGE.SUCCESS.CODES,
        ...success,
      },
      MESSAGES: {
        ...createMessages(BASE_MESSAGE.SUCCESS.CODES, "success"),
        ...createMessages(success, "success"),
      },
    },
  } as const
}
