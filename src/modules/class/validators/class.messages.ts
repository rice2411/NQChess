export const CLASS_MESSAGES = {
  // Validation messages
  MISSING_REQUIRED_FIELDS:
    "Missing required fields: name, startDate, endDate, schedules",
  INVALID_NAME: "Class name must be between 2 and 50 characters",
  INVALID_START_DATE:
    "Invalid start date format (dd/mm/yyyy) or date is in the past",
  INVALID_END_DATE:
    "Invalid end date format (dd/mm/yyyy) or date is before start date",
  INVALID_SCHEDULES: "Invalid schedules format",
  INVALID_STUDENT_DATA: "Invalid student data format",
  INVALID_STATUS: "Invalid class status",
  INVALID_TUITION: "Tuition must be a positive number",
  INVALID_STUDENT_STATUS: "Invalid student status",

  // Success messages
  CREATE_SUCCESS: "Class created successfully",
  UPDATE_SUCCESS: "Class updated successfully",
  DELETE_SUCCESS: "Class deleted successfully",
  ADD_STUDENTS_SUCCESS: "Students added to class successfully",

  // Error messages
  CREATE_FAILED: "Failed to create class",
  UPDATE_FAILED: "Failed to update class",
  DELETE_FAILED: "Failed to delete class",
  CLASS_NOT_FOUND: "Class not found",
  DUPLICATE_STUDENTS: "Some students are already in the class",
}
