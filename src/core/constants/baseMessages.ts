export const BASE_MESSAGE = {
  VALIDATION: {
    CODES: {
      MISSING_REQUIRED_FIELDS: "MISSING_REQUIRED_FIELDS",
    },
    MESSAGES: {
      MISSING_REQUIRED_FIELDS: "validation.missingRequiredFields",
    },
  },
  ERRORS: {
    CODES: {
      NOT_FOUND: "NOT_FOUND",
      CREATE_FAILED: "CREATE_FAILED",
      UPDATE_FAILED: "UPDATE_FAILED",
      DELETE_FAILED: "DELETE_FAILED",
    },
    MESSAGES: {
      NOT_FOUND: "errors.notFound",
      CREATE_FAILED: "errors.createFailed",
      UPDATE_FAILED: "errors.updateFailed",
      DELETE_FAILED: "errors.deleteFailed",
    },
  },
  SUCCESS: {
    CODES: {
      CREATE_SUCCESS: "CREATE_SUCCESS",
      UPDATE_SUCCESS: "UPDATE_SUCCESS",
      DELETE_SUCCESS: "DELETE_SUCCESS",
    },
    MESSAGES: {
      CREATE_SUCCESS: "success.createSuccess",
      UPDATE_SUCCESS: "success.updateSuccess",
      DELETE_SUCCESS: "success.deleteSuccess",
    },
  },
} as const

export type BaseValidationErrorCode = typeof BASE_MESSAGE.VALIDATION.CODES
export type BaseErrorCode = typeof BASE_MESSAGE.ERRORS.CODES
export type BaseSuccessCode = typeof BASE_MESSAGE.SUCCESS.CODES
