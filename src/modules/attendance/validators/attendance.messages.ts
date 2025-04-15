import i18n from "@/core/config/i18n"

export const ATTENDANCE_MESSAGES = {
  // Validation messages
  INVALID_STATUS: i18n.t("attendance.validation.invalidStatus"),
  INVALID_DATE: i18n.t("attendance.validation.invalidDate"),
  MISSING_REQUIRED_FIELDS: i18n.t(
    "attendance.validation.missingRequiredFields"
  ),

  // Error messages
  ATTENDANCE_NOT_FOUND: i18n.t("attendance.errors.notFound"),
  CREATE_FAILED: i18n.t("attendance.errors.createFailed"),
  UPDATE_FAILED: i18n.t("attendance.errors.updateFailed"),
  DELETE_FAILED: i18n.t("attendance.errors.deleteFailed"),

  // Success messages
  CREATE_SUCCESS: i18n.t("attendance.success.createSuccess"),
  UPDATE_SUCCESS: i18n.t("attendance.success.updateSuccess"),
  DELETE_SUCCESS: i18n.t("attendance.success.deleteSuccess"),
} as const
