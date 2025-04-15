import i18n from "@/core/config/i18n"

export const TUITION_MESSAGES = {
  // Validation messages
  INVALID_AMOUNT: i18n.t("tuition.validation.invalidAmount"),
  INVALID_MONTH: i18n.t("tuition.validation.invalidMonth"),
  INVALID_STATUS: i18n.t("tuition.validation.invalidStatus"),
  MISSING_REQUIRED_FIELDS: i18n.t("tuition.validation.missingRequiredFields"),

  // Error messages
  TUITION_NOT_FOUND: i18n.t("tuition.errors.notFound"),
  CREATE_FAILED: i18n.t("tuition.errors.createFailed"),
  UPDATE_FAILED: i18n.t("tuition.errors.updateFailed"),
  DELETE_FAILED: i18n.t("tuition.errors.deleteFailed"),

  // Success messages
  CREATE_SUCCESS: i18n.t("tuition.success.createSuccess"),
  UPDATE_SUCCESS: i18n.t("tuition.success.updateSuccess"),
  DELETE_SUCCESS: i18n.t("tuition.success.deleteSuccess"),
} as const
