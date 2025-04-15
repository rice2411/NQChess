import i18n from "@/core/config/i18n"

export const LESSON_MESSAGES = {
  // Validation messages
  INVALID_TITLE: i18n.t("lesson.validation.invalidTitle"),
  INVALID_DESCRIPTION: i18n.t("lesson.validation.invalidDescription"),
  INVALID_DATE: i18n.t("lesson.validation.invalidDate"),
  INVALID_START_TIME: i18n.t("lesson.validation.invalidStartTime"),
  INVALID_END_TIME: i18n.t("lesson.validation.invalidEndTime"),
  INVALID_STATUS: i18n.t("lesson.validation.invalidStatus"),
  MISSING_REQUIRED_FIELDS: i18n.t("lesson.validation.missingRequiredFields"),

  // Error messages
  LESSON_NOT_FOUND: i18n.t("lesson.errors.notFound"),
  CREATE_FAILED: i18n.t("lesson.errors.createFailed"),
  UPDATE_FAILED: i18n.t("lesson.errors.updateFailed"),
  DELETE_FAILED: i18n.t("lesson.errors.deleteFailed"),

  // Success messages
  CREATE_SUCCESS: i18n.t("lesson.success.createSuccess"),
  UPDATE_SUCCESS: i18n.t("lesson.success.updateSuccess"),
  DELETE_SUCCESS: i18n.t("lesson.success.deleteSuccess"),
} as const
