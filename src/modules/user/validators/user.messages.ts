import i18n from "@/core/config/i18n"

export const USER_MESSAGES = {
  // Validation messages
  INVALID_USERNAME: i18n.t("user.validation.invalidUsername"),
  INVALID_PASSWORD: i18n.t("user.validation.invalidPassword"),
  INVALID_EMAIL: i18n.t("user.validation.invalidEmail"),
  INVALID_PHONE: i18n.t("user.validation.invalidPhone"),
  INVALID_ROLE: i18n.t("user.validation.invalidRole"),
  MISSING_REQUIRED_FIELDS: i18n.t("user.validation.missingRequiredFields"),

  // Error messages
  USER_NOT_FOUND: i18n.t("user.errors.notFound"),
  CREATE_FAILED: i18n.t("user.errors.createFailed"),
  UPDATE_FAILED: i18n.t("user.errors.updateFailed"),
  DELETE_FAILED: i18n.t("user.errors.deleteFailed"),

  // Success messages
  CREATE_SUCCESS: i18n.t("user.success.createSuccess"),
  UPDATE_SUCCESS: i18n.t("user.success.updateSuccess"),
  DELETE_SUCCESS: i18n.t("user.success.deleteSuccess"),
} as const
