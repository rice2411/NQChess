import i18n from "@/core/config/i18n"
export const STUDENT_MESSAGES = {
  // Validation messages
  INVALID_NAME: i18n.t("student.validation.invalidName"),
  INVALID_PHONE: i18n.t("student.validation.invalidPhone"),
  INVALID_DOB: i18n.t("student.validation.invalidDob"),
  INVALID_GENDER: i18n.t("student.validation.invalidGender"),
  INVALID_CLASSES: i18n.t("student.validation.invalidClasses"),
  MISSING_REQUIRED_FIELDS: i18n.t("student.validation.missingRequiredFields"),

  // Error messages
  STUDENT_NOT_FOUND: i18n.t("student.errors.notFound"),
  CREATE_FAILED: i18n.t("student.errors.createFailed"),
  UPDATE_FAILED: i18n.t("student.errors.updateFailed"),
  DELETE_FAILED: i18n.t("student.errors.deleteFailed"),

  // Success messages
  CREATE_SUCCESS: i18n.t("student.success.createSuccess"),
  UPDATE_SUCCESS: i18n.t("student.success.updateSuccess"),
  DELETE_SUCCESS: i18n.t("student.success.deleteSuccess"),
} as const
