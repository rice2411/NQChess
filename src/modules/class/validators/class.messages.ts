import i18n from "@/core/config/i18n"
export const CLASS_MESSAGES = {
  // Validation messages
  MISSING_REQUIRED_FIELDS: i18n.t("class.validation.missingRequiredFields"),
  INVALID_NAME: i18n.t("class.validation.invalidName"),
  INVALID_START_DATE: i18n.t("class.validation.invalidStartDate"),
  INVALID_END_DATE: i18n.t("class.validation.invalidEndDate"),
  INVALID_SCHEDULES: i18n.t("class.validation.invalidSchedules"),
  INVALID_STUDENT_DATA: i18n.t("class.validation.invalidStudentData"),
  INVALID_STATUS: i18n.t("class.validation.invalidStatus"),
  INVALID_TUITION: i18n.t("class.validation.invalidTuition"),
  INVALID_STUDENT_STATUS: i18n.t("class.validation.invalidStudentStatus"),

  // Success messages
  CREATE_SUCCESS: i18n.t("class.success.createSuccess"),
  UPDATE_SUCCESS: i18n.t("class.success.updateSuccess"),
  DELETE_SUCCESS: i18n.t("class.success.deleteSuccess"),
  ADD_STUDENTS_SUCCESS: i18n.t("class.success.addStudentsSuccess"),

  // Error messages
  CREATE_FAILED: i18n.t("class.errors.createFailed"),
  UPDATE_FAILED: i18n.t("class.errors.updateFailed"),
  DELETE_FAILED: i18n.t("class.errors.deleteFailed"),
  CLASS_NOT_FOUND: i18n.t("class.errors.notFound"),
  DUPLICATE_STUDENTS: i18n.t("class.errors.duplicateStudents"),
}
